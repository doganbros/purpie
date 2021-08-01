import bcrypt from 'bcryptjs';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AuthService } from '../auth.service';
import {
  UserBasic,
  UserPayload,
  UserPayloadWithToken,
} from '../interfaces/user.interface';
import { LoginUserDto } from '../dto/login-user.dto';
import { ParseTokenPipe } from '../pipes/parse-token.pipe';
import { ResetPasswordRequestDto } from '../dto/reset-password-request.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { IsAuthenticated } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

const {
  MAIL_VERIFICATION_TOKEN_SECRET = 'secret_m',
  RESET_PASSWORD_TOKEN_SECRET = 'secret_r',
} = process.env;

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    type: UserBasic,
    description: 'Registers user and returns basic details',
  })
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
  @ApiOkResponse({
    type: UserPayloadWithToken,
    description: `Signs in user. If it contains a header subdomain, it will be validated. If user's email is not verified an unauthorized error will be thrown. `,
  })
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Headers('app-subdomain') subdomain: string,
  ): Promise<UserPayloadWithToken> {
    if (subdomain)
      await this.authService.subdomainValidity(subdomain, loginUserDto.email);

    const user = await this.authService.getUserByEmail(loginUserDto.email);

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

    const userPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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

    const token = await this.authService.generateLoginToken(userPayload);

    return {
      user: userPayload,
      token,
    };
  }

  @Post('/verify-email')
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
        MAIL_VERIFICATION_TOKEN_SECRET,
        'Email verification token is invalid',
      ),
    )
    { email }: UserBasic,
    @Body() { token }: VerifyEmailDto,
  ) {
    const user = await this.authService.verifyUserEmail(email, token);
    return user;
  }

  @Post('resend-mail-verification-token/:userId')
  async resendMailVerificationToken(@Param('userId') userId: string) {
    const userInfo = await this.authService.verifyResendMailVerificationToken(
      Number.parseInt(userId, 10),
    );

    await this.authService.sendAccountVerificationMail(userInfo);
    return userInfo.user;
  }

  @Post('/reset-password-request')
  @ApiCreatedResponse({
    description: `User makes a password reset request. The email received is sent back.`,
  })
  async resetPasswordRequest(@Body() payload: ResetPasswordRequestDto) {
    const user = await this.authService.getUserByEmail(payload.email);

    if (!user)
      throw new NotFoundException(
        `User with the email ${payload.email} doesn't exist`,
        'USER_NOT_FOUND',
      );

    const token = await this.authService.generateResetPasswordToken(
      payload.email,
    );
    user.forgotPasswordToken = await bcrypt.hash(token, 10);
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
    description: `User makes a password reset.`,
  })
  async resetPassword(
    @Body(
      'token',
      new ParseTokenPipe(
        RESET_PASSWORD_TOKEN_SECRET,
        'Password reset token is invalid',
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

  @IsAuthenticated()
  @ApiOkResponse({
    type: UserPayload,
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
    @CurrentUser() currentUser: UserPayload,
    @Headers('app-subdomain') subdomain: string,
  ) {
    if (subdomain) {
      await this.authService.subdomainValidity(subdomain, currentUser.email);
    }
    return currentUser;
  }
}
