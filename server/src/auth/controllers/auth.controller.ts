import bcrypt from 'bcryptjs';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { hash } from 'helpers/utils';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AuthService } from '../auth.service';
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

const { VERIFICATION_TOKEN_SECRET = '' } = process.env;
@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    type: UserBasic,
    description: 'Registers user and returns basic details',
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
    description: "Error thrown when user's email or password is invalid ",
    schema: errorResponseDoc(
      404,
      'Error user name or password',
      'ERROR_USERNAME_OR_PASSWORD',
    ),
  })
  @ApiUnauthorizedResponse({
    description: 'Error thrown when email is not yet verified',
    schema: errorResponseDoc(
      401,
      'Error user name or password',
      'ERROR_USERNAME_OR_PASSWORD',
      {
        user: {
          schema: {
            $ref: getSchemaPath(UserProfile),
          },
        },
      },
    ),
  })
  @ApiOkResponse({
    type: UserProfile,
    description: `Signs in user. If it contains a header subdomain, it will be validated. If user's email is not verified an unauthorized error will be thrown. `,
  })
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Headers('app-subdomain') subdomain: string,
    @Res({ passthrough: true }) res: Response,
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
        'Error user name or password',
        'ERROR_USERNAME_OR_PASSWORD',
      );

    const validPassword = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!validPassword)
      throw new NotFoundException(
        'Error user name or password',
        'ERROR_USERNAME_OR_PASSWORD',
      );

    const userPayload: UserProfile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      mattermostId: user.mattermostId,
      userRole: {
        ...user.userRole,
      },
    };

    if (!user.emailConfirmed)
      throw new UnauthorizedException({
        message: 'Email must be verified',
        error: 'MUST_VERIFY_EMAIL',
        user: userPayload,
      });

    const {
      token,
      id,
    } = await this.authService.createMattermostPersonalTokenForUser(
      user.mattermostId,
    );

    await this.authService.setAccessTokens(
      {
        id: user.id,
        mattermostId: user.mattermostId,
        mattermostTokenId: id,
      },
      res,
      token,
    );

    return userPayload;
  }

  @Post('/logout')
  @IsAuthenticated([], { removeAccessTokens: true })
  @ApiOkResponse({ schema: { type: 'string', example: 'OK' } })
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: UserTokenPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.removeRefreshToken(user.id, user.refreshTokenId!);

    this.authService.removeAccessTokens(res);

    return 'OK';
  }

  @Post('/initial-user')
  @UseGuards(InitialUserGuard)
  @ApiUnauthorizedResponse({
    description: 'Error thrown when initial user has already been set',
    schema: errorResponseDoc(
      401,
      'Initial user has been specified already',
      'INITIAL_USER_SPECIFIED',
    ),
  })
  async setInitialUser(
    @Body() info: InitializeUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.initializeUser(info, res);
  }

  @Post('/verify-email')
  @ValidationBadRequest()
  @ApiNotFoundResponse({
    description: 'Error thrown when user is not found',
    schema: errorResponseDoc(404, 'User not found', 'USER_NOT_FOUND'),
  })
  @ApiUnauthorizedResponse({
    description: 'Error thrown when jw used to verify the email is invalid',
    schema: errorResponseDoc(
      404,
      'Email verification token is invalid',
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
    return user;
  }

  @Post('resend-mail-verification-token/:userId')
  @ApiCreatedResponse({
    type: UserBasic,
    description: 'Basic information about the user the email was sent to',
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when user is not found',
    schema: errorResponseDoc(404, 'User not found', 'USER_NOT_FOUND'),
  })
  async resendMailVerificationToken(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const userInfo = await this.authService.verifyResendMailVerificationToken(
      userId,
    );

    await this.authService.sendAccountVerificationMail(userInfo);
    return userInfo.user;
  }

  @Post('/reset-password-request')
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
  async resetPasswordRequest(@Body() payload: ResetPasswordRequestDto) {
    const user = await this.authService.getUserByEmail(payload.email);

    if (!user)
      throw new NotFoundException(
        `User with the email '${payload.email}' doesn't exist`,
        'USER_NOT_FOUND',
      );

    const token = await this.authService.generateResetPasswordToken(
      payload.email,
    );
    user.forgotPasswordToken = await hash(token);
    await user.save();

    const userBasicWithToken = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    };
    await this.authService.sendResetPasswordMail(userBasicWithToken);
    return user.email;
  }

  @Put('/reset-password')
  @ApiCreatedResponse({
    description: 'User makes a password reset.',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiUnauthorizedResponse({
    description: 'Error thrown when jwt used to verify the email is invalid',
    schema: errorResponseDoc(
      404,
      'Password reset token is invalid',
      'INVALID_JWT',
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
  ) {
    const user = await this.authService.getUserByEmailAndResetPasswordToken(
      email,
      token,
    );

    user.password = await bcrypt.hash(password, 10);

    user.forgotPasswordToken = null!;

    user.save();

    return 'OK';
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
