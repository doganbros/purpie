import { stringify as stringifyQuery } from 'querystring';
import bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { Request, Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import {
  UserBasic,
  UserBasicWithToken,
  UserPayloadWithToken,
} from './interfaces/user.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { ParseTokenPipe } from './pipes/parse-token.pipe';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ThirdPartyLoginParams } from './dto/third-party-login.params';
import { IsAuthenticated } from './decorators/auth.decorator';
import { AuthByThirdPartyDto } from './dto/auth-by-third-party.dto';

const {
  MAIL_VERIFICATION_TOKEN_SECRET = 'secret_m',
  GOOGLE_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_ID = '',
  REACT_APP_CLIENT_HOST = '',
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
    if (subdomain) {
      await this.authService.subdomainValidity(subdomain, loginUserDto.email);
    }

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
    };

    if (!user.emailConfirmed)
      throw new UnauthorizedException({
        message: 'Email must be verified',
        error: 'MUST_VERIFY_EMAIL',
        ...userPayload,
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
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserBasic,
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
    @Req() req: Request & { user: UserBasic },
    @Headers('app-subdomain') subdomain: string,
  ) {
    if (subdomain) {
      await this.authService.subdomainValidity(subdomain, req.user.email);
    }
    return req.user;
  }

  @Get('/third-party/:name')
  @ApiParam({
    name: 'name',
    type: String,
  })
  @ApiOkResponse({
    description: `User is redirected to a third-party to sign in.`,
  })
  async thirdPartyLogin(
    @Param() { name }: ThirdPartyLoginParams,
    @Res() res: Response,
  ) {
    if (name === 'google') {
      const stringifiedQuery = stringifyQuery({
        client_id: GOOGLE_OAUTH_CLIENT_ID,
        redirect_uri: `${REACT_APP_CLIENT_HOST}/auth/google`,
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '),
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
      });

      return res.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedQuery}`,
      );
    }

    if (name === 'facebook') {
      const stringifiedQuery = stringifyQuery({
        client_id: FACEBOOK_OAUTH_CLIENT_ID,
        redirect_uri: `${REACT_APP_CLIENT_HOST}/auth/facebook`,
        scope: ['email', 'public_profile'].join(','),
        response_type: 'code',
        auth_type: 'rerequest',
      });

      return res.redirect(
        `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedQuery}`,
      );
    }

    throw new BadRequestException('Not implemented', 'NOT_IMPLEMENTED');
  }

  @Post('/third-party/:name')
  @ApiParam({
    name: 'name',
    type: String,
  })
  @ApiOkResponse({
    type: UserBasicWithToken,
    description: `User signs in with a third-party. `,
  })
  @HttpCode(HttpStatus.OK)
  async authenticateByThirdParty(
    @Param() { name }: ThirdPartyLoginParams,
    @Body() { code }: AuthByThirdPartyDto,
  ) {
    let user: User | undefined;
    if (name === 'google') {
      const accessToken = await this.authService.getGoogleAuthAccessToken(code);
      const userInfo = await this.authService.getGoogleUserInfo(accessToken);

      user = await this.authService.getUserByEmail(userInfo.email);

      if (user) {
        if (!user.googleId) {
          user.googleId = userInfo.id;
          user = await user.save();
        }
      } else {
        user = await this.authService.registerUserByThirdParty({
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          email: userInfo.email,
          googleId: userInfo.id,
        });
      }
    } else if (name === 'facebook') {
      const accessToken = await this.authService.getFacebookAuthAccessToken(
        code,
      );
      const userInfo = await this.authService.getFacebookUserInfo(accessToken);

      user = await this.authService.getUserByEmail(userInfo.email);

      if (user) {
        if (!user.facebookId) {
          user.facebookId = userInfo.id;
          user = await user.save();
        }
      } else {
        user = await this.authService.registerUserByThirdParty({
          firstName:
            userInfo.first_name +
            (userInfo.middle_name ? ` ${userInfo.middle_name}` : ''),
          lastName: userInfo.last_name,
          email: userInfo.email,
          facebookId: userInfo.id,
        });
      }
    }
    if (user) {
      const userPayload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      const token = await this.authService.generateLoginToken(userPayload);

      return {
        user: userPayload,
        token,
      };
    }

    throw new InternalServerErrorException(
      `Something went wrong while authenticating using ${name}`,
      'THIRD_PARTH_AUTH_ERROR',
    );
  }
}
