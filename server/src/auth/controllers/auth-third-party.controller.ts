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
import { Response } from 'express';
import { ApiParam, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { AuthByThirdPartyDto } from '../dto/auth-by-third-party.dto';
import { ThirdPartyLoginParams } from '../dto/third-party-login.params';
import { UserProfile } from '../interfaces/user.interface';
import { AuthThirdPartyService } from '../services/auth-third-party.service';
import { AuthService } from '../services/auth.service';

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

    throw new BadRequestException('Not implemented', 'NOT_IMPLEMENTED');
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
  ) {
    let user: User | undefined;
    let userExistsAlready = false;
    if (name === 'google') {
      const accessToken = await this.authThirdPartyService.getGoogleAuthAccessToken(
        code,
      );
      const userInfo = await this.authThirdPartyService.getGoogleUserInfo(
        accessToken,
      );

      user = await this.authService.getUserByEmail(userInfo.email);

      if (user) {
        userExistsAlready = true;
        if (!user.googleId) {
          user.googleId = userInfo.id;
          user = await user.save();
        }
      } else {
        user = await this.authThirdPartyService.registerUserByThirdParty({
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          email: userInfo.email,
          googleId: userInfo.id,
        });
      }
    } else if (name === 'facebook') {
      const accessToken = await this.authThirdPartyService.getFacebookAuthAccessToken(
        code,
      );
      const userInfo = await this.authThirdPartyService.getFacebookUserInfo(
        accessToken,
      );

      user = await this.authService.getUserByEmail(userInfo.email);

      if (user) {
        userExistsAlready = true;
        if (!user.facebookId) {
          user.facebookId = userInfo.id;
          user = await user.save();
        }
      } else {
        user = await this.authThirdPartyService.registerUserByThirdParty({
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
      if (!userExistsAlready) {
        const profile = await this.authService.createMattermostUserAndJoinDefaults(
          user,
        );
        user.mattermostId = profile.id;
        userPayload.mattermostId = profile.id;
        await user.save();
      }

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

    throw new InternalServerErrorException(
      `Something went wrong while authenticating using ${name}`,
      'THIRD_PARTH_AUTH_ERROR',
    );
  }
}
