import { stringify as stringifyQuery } from 'querystring';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { Response } from 'express';
import { ApiParam, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { AuthByThirdPartyDto } from '../dto/auth-by-third-party.dto';
import { ThirdPartyLoginParams } from '../dto/third-party-login.params';
import { UserBasicWithToken } from '../interfaces/user.interface';
import { AuthService } from '../auth.service';

const {
  GOOGLE_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_ID = '',
  REACT_APP_CLIENT_HOST = '',
} = process.env;

@Controller({ path: 'auth/third-party', version: '1' })
@ApiTags('auth-third-party')
export class AuthThirdPartyController {
  constructor(private authService: AuthService) {}

  @Get('/:name')
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

  @Post('/:name')
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
    @Res({ passthrough: true }) res: Response,
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
        userRole: {
          ...user.userRole,
        },
      };
      const token = await this.authService.generateLoginToken(userPayload);

      res.cookie('OCTOPUS_ACCESS_TOKEN', token, {
        expires: dayjs().add(1, 'hour').toDate(),
      });
      return userPayload;
    }

    throw new InternalServerErrorException(
      `Something went wrong while authenticating using ${name}`,
      'THIRD_PARTH_AUTH_ERROR',
    );
  }
}
