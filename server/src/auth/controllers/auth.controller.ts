import bcrypt from 'bcryptjs';
import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { hash } from 'helpers/utils';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AuthService } from '../services/auth.service';
import {
  UserBasic,
  UserProfile,
  UserTokenPayload,
} from '../interfaces/user.interface';
import { LoginUserDto } from '../dto/login-user.dto';
import { ParseTokenPipe } from '../pipes/parse-token.pipe';
import { ResetPasswordRequestDto } from '../dto/reset-password-request.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { IsAuthenticated } from '../decorators/auth.decorator';
import {
  CurrentUser,
  CurrentUserProfile,
} from '../decorators/current-user.decorator';
import {
  MAIL_VERIFICATION_TYPE,
  PASSWORD_VERIFICATION_TYPE,
} from '../constants/auth.constants';
import { InitialUserGuard } from '../guards/initial-user.guard';
import { InitializeUserDto } from '../dto/initialize-user.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { ChangePasswordDto } from '../dto/change-password.dto';

const { VERIFICATION_TOKEN_SECRET = '' } = process.env;

@ApiExcludeController()
@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    type: UserBasic,
    description:
      'User register with requested payload and returns user basic details',
  })
  @ValidationBadRequest()
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserBasic> {
    const registeredUser = await this.authService.registerUser(registerUserDto);
    await this.authService.sendAccountVerificationMail(registeredUser);
    return registeredUser.user;
  }

  @Post('login')
  @ApiHeader({
    name: 'app-subdomain',
    required: false,
    description: 'Zone subdomain',
  })
  @ValidationBadRequest()
  @ApiNotFoundResponse({
    description: 'Error thrown when requested fields are invalid.',
    schema: errorResponseDoc(
      404,
      'Invalid username or password.',
      'ERROR_USERNAME_OR_PASSWORD',
    ),
  })
  @ApiUnauthorizedResponse({
    description: 'Error thrown when email is not yet verified',
    schema: errorResponseDoc(
      401,
      'Email must be verified.',
      'MUST_VERIFY_EMAIL',
    ),
  })
  @ApiOkResponse({
    type: UserProfile,
    description: `Signs in user. If it contains a header subdomain, it will be validated. If user's email is not verified then unauthorized error will be thrown. `,
  })
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Headers('app-subdomain') subdomain: string,
  ) {
    if (subdomain)
      await this.authService.subdomainValidity(
        subdomain,
        loginUserDto.emailOrUserName,
      );

    const user = await this.authService.getUserByEmailOrUserName(
      loginUserDto.emailOrUserName,
    );

    if (!user)
      throw new NotFoundException(
        ErrorTypes.ERROR_USERNAME_OR_PASSWORD,
        'Invalid username or password.',
      );

    if (!user.password)
      throw new ForbiddenException(
        ErrorTypes.USER_DIDNT_REGISTER_WITH_PASSWORD,
        'User did not register with password',
      );

    const validPassword = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!validPassword)
      throw new NotFoundException(
        ErrorTypes.ERROR_USERNAME_OR_PASSWORD,
        'Invalid username or password.',
      );

    const userPayload: UserProfile = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      userName: user.userName,
      displayPhoto: user.displayPhoto,
      userRole: {
        ...user.userRole,
      },
    };

    if (!user.emailConfirmed)
      throw new UnauthorizedException(
        { message: ErrorTypes.MUST_VERIFY_EMAIL, user: userPayload },
        'Email must be verified',
      );

    const {
      accessToken,
      refreshToken,
    } = await this.authService.setAccessTokens({
      id: user.id,
    });

    return { user: userPayload, accessToken, refreshToken };
  }

  @Post('/logout')
  @IsAuthenticated([], { removeAccessTokens: true })
  @ApiOkResponse({
    description: 'Ok code returned when logout successfully.',
  })
  async logout(@CurrentUser() user: UserTokenPayload) {
    await this.authService.removeRefreshToken(user.id, user.refreshTokenId!);
  }

  @Post('/initial-user')
  @ApiExcludeEndpoint()
  @UseGuards(InitialUserGuard)
  async setInitialUser(@Body() info: InitializeUserDto) {
    return this.authService.initializeUser(info);
  }

  @Post('/verify-email')
  @ValidationBadRequest()
  @ApiNotFoundResponse({
    description: 'Error thrown when user is not found.',
    schema: errorResponseDoc(
      404,
      "User with the email '<email>' doesn't exist",
      'USER_NOT_FOUND',
    ),
  })
  @ApiUnauthorizedResponse({
    description: 'Error thrown when used JWT to verify the email is invalid',
    schema: errorResponseDoc(
      401,
      'Email confirmation JWT is invalid',
      'INVALID_JWT',
    ),
  })
  @ApiCreatedResponse({
    type: UserBasic,
    description: `User verifies email received from inbox. `,
  })
  @ApiBody({
    type: VerifyEmailDto,
  })
  async verifyUserEmail(
    @Body(
      'token',
      new ParseTokenPipe(
        VERIFICATION_TOKEN_SECRET,
        'Email verification token is invalid',
        (payload) => payload.verificationType === MAIL_VERIFICATION_TYPE,
      ),
    )
    { email }: UserBasic,
    @Body() { token, userName }: VerifyEmailDto,
  ) {
    const user = await this.authService.verifyUserEmail(email, userName, token);
    return { fullName: user.fullName, email: user.email };
  }

  @Post('resend-verification-mail/:userId')
  @ApiCreatedResponse({
    description: 'Verification email sent to requested email address',
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when user is not found',
    schema: errorResponseDoc(404, 'User not found', 'USER_NOT_FOUND'),
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when user has already verified email address.',
    schema: errorResponseDoc(
      400,
      'User already registered',
      'USER_ALREADY_REGISTERED',
    ),
  })
  async resendMailVerificationToken(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Res() res: Response,
  ) {
    const userInfo = await this.authService.verifyResendMailVerificationToken(
      userId,
    );

    await this.authService.sendAccountVerificationMail(userInfo);
    return res.status(201);
  }

  @Post('/request-reset-password')
  @ApiCreatedResponse({
    schema: { type: 'string' },
    description: `User makes a password reset request. The email received is sent back.`,
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when user with the email is not found',
    schema: errorResponseDoc(
      404,
      "User with the email '<email>' doesn't exist",
      'USER_NOT_FOUND',
    ),
  })
  @ValidationBadRequest()
  async resetPasswordRequest(
    @Body() payload: ResetPasswordRequestDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.getUserByEmail(payload.email);

    if (!user)
      throw new NotFoundException(
        ErrorTypes.USER_NOT_FOUND,
        `User with the email '${payload.email}' doesn't exist`,
      );

    const token = await this.authService.generateResetPasswordToken(
      payload.email,
    );
    user.forgotPasswordToken = await hash(token);
    await user.save();

    const userBasicWithToken = {
      user: {
        fullName: user.fullName,
        email: user.email,
      },
      token,
    };
    await this.authService.sendResetPasswordMail(userBasicWithToken);
    return res.status(201);
  }

  @Put('/reset-password')
  @ApiCreatedResponse({
    description: 'User reset password successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Error thrown when JWT used to reset password is invalid',
    schema: errorResponseDoc(
      404,
      'Password reset token is invalid',
      'INVALID_PASSWORD_RESET_TOKEN',
    ),
  })
  @ValidationBadRequest()
  async resetPassword(
    @Body(
      'token',
      new ParseTokenPipe(
        VERIFICATION_TOKEN_SECRET,
        'Password reset token is invalid',
        (payload) => payload.verificationType === PASSWORD_VERIFICATION_TYPE,
      ),
    )
    {
      email,
    }: {
      email: string;
    },
    @Body() { password, token }: ResetPasswordDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.getUserByEmailAndResetPasswordToken(
      email,
      token,
    );

    user.password = await bcrypt.hash(password, 10);

    user.forgotPasswordToken = null!;

    await user.save();

    return res.status(201);
  }

  @Put('/change-password')
  @ApiCreatedResponse({
    description: 'User changes password successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when requested passwords are not match',
    schema: errorResponseDoc(
      400,
      'New password and confirm passwords needs to be same.',
      'PASSWORDS_NOT_MATCH',
    ),
  })
  @ApiForbiddenResponse({
    description: 'Error thrown when current password is invalid',
    schema: errorResponseDoc(
      403,
      'User current password is invalid.',
      'CURRENT_PASSWORD_NOT_CORRECT',
    ),
  })
  @ValidationBadRequest()
  @IsAuthenticated()
  async changePassword(
    @CurrentUser() user: UserTokenPayload,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.changePassword(user.id, changePasswordDto);

    return res.status(200);
  }

  @IsAuthenticated([], { injectUserProfile: true })
  @ApiOkResponse({
    type: UserProfile,
    description: `Verifies current token and retrieves user.`,
  })
  @ApiHeader({
    name: 'app-subdomain',
    required: false,
    description: 'Zone subdomain',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/retrieve')
  async retrieveUser(
    @CurrentUserProfile() userProfile: UserProfile,
    @Headers('app-subdomain') subdomain: string,
  ) {
    if (subdomain) {
      await this.authService.subdomainValidity(subdomain, userProfile.id);
    }

    return userProfile;
  }
}
