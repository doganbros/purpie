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
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiParam, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { AuthByThirdPartyDto } from '../dto/auth-by-third-party.dto';
import { ThirdPartyLoginParams } from '../dto/third-party-login.params';
import { UserProfile } from '../interfaces/user.interface';
import { AuthThirdPartyService } from '../services/auth-third-party.service';
import { AuthService } from '../services/auth.service';
import { ErrorTypes } from '../../../types/ErrorTypes';

const {
  GOOGLE_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_ID = '',
  REACT_APP_CLIENT_HOST = '',
} = process.env;

@Controller({ path: 'auth/third-party', version: '1' })
@ApiTags('auth-third-party')
export class AuthThirdPartyController {
  constructor(
    private authService: AuthService,
    private authThirdPartyService: AuthThirdPartyService,
  ) {}

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

    throw new BadRequestException(
      ErrorTypes.NOT_IMPLEMENTED,
      'Not implemented',
    );
  }

  @Post('/:name')
  @ApiParam({
    name: 'name',
    type: String,
  })
  @ApiOkResponse({
    type: UserProfile,
    description: `User signs in with a third-party. `,
  })
  @HttpCode(HttpStatus.OK)
  async authenticateByThirdParty(
    @Param() { name }: ThirdPartyLoginParams,
    @Body() { code }: AuthByThirdPartyDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    let user: User | undefined;
    if (name === 'google') {
      const accessToken = await this.authThirdPartyService.getGoogleAuthAccessToken(
        code,
      );
      const userInfo = await this.authThirdPartyService.getGoogleUserInfo(
        accessToken,
      );

      user = await this.authService.getUserByEmail(userInfo.email);

      if (user) {
        if (!user.googleId) {
          user.googleId = userInfo.id;
          user = await user.save();
        }
      } else {
        user = await this.authThirdPartyService.registerUserByThirdParty({
          fullName: `${userInfo.given_name} ${userInfo.family_name}`,
          email: userInfo.email,
          googleId: userInfo.id,
        });
      }
    } else if (name === 'facebook') {
      const accessToken = await this.authThirdPartyService.getFacebookAuthAccessToken(
        code,
      );
      const userInfo = await this.authThirdPartyService.getFacebookUserInfo(
        accessToken.access_token,
      );

      user = await this.authService.getUserByEmail(userInfo.email);

      if (user) {
        if (!user.facebookId) {
          user.facebookId = userInfo.id;
          user = await user.save();
        }
      } else {
        user = await this.authThirdPartyService.registerUserByThirdParty({
          fullName: `${userInfo.first_name}${
            userInfo.middle_name ? ` ${userInfo.middle_name} ` : ' '
          }${userInfo.last_name}`,
          email: userInfo.email,
          facebookId: userInfo.id,
        });
      }
    }
    if (user) {
      const userPayload: UserProfile = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userName: user.userName,
        userRole: {
          ...user.userRole,
        },
      };

      await this.authService.setAccessTokens(
        {
          id: user.id,
        },
        res,
        req,
      );

      return userPayload;
    }

    throw new InternalServerErrorException(
      ErrorTypes.THIRD_PARTY_AUTH_ERROR,
      `Something went wrong while authenticating using ${name}`,
    );
  }
}
