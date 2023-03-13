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
import { Request, Response } from 'express';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import jwt from 'jsonwebtoken';
import { AuthByThirdPartyDto } from '../dto/auth-by-third-party.dto';
import { ThirdPartyLoginParams } from '../dto/third-party-login.params';
import { UserProfile } from '../interfaces/user.interface';
import { AuthThirdPartyService } from '../services/auth-third-party.service';
import { AuthService } from '../services/auth.service';
import { ErrorTypes } from '../../../types/ErrorTypes';

const {
  GOOGLE_OAUTH_CLIENT_ID = '',
  REACT_APP_CLIENT_HOST = '',
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URI,
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
    if (name === 'apple') {
      const stringifiedQuery = stringifyQuery({
        client_id: APPLE_CLIENT_ID,
        redirect_uri: APPLE_REDIRECT_URI,
        response_type: 'code id_token',
        state: 'purpie-apple-auth-state',
        scope: 'email name',
        response_mode: 'form_post',
      });
      return res.redirect(
        `https://appleid.apple.com/auth/authorize?${stringifiedQuery}`,
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
    @Body() body: AuthByThirdPartyDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    let user: User | undefined;
    if (name === 'google') {
      const accessToken = await this.authThirdPartyService.getGoogleAuthAccessToken(
        body.code,
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
      const {
        token,
      } = await this.authThirdPartyService.registerUserByThirdParty({
        fullName: `${userInfo.given_name} ${userInfo.family_name}`,
        email: userInfo.email,
        googleId: userInfo.id,
      });
      return res.redirect(`${REACT_APP_CLIENT_HOST}/verify-email/${token}`);
    }
    if (name === 'apple') {
      let userInfo;
      if (body.user) userInfo = JSON.parse(body.user);
      else if (body.id_token) {
        const idTokePayload: any = jwt.decode(body.id_token);
        userInfo = { email: idTokePayload?.email.toLowerCase() };
      }

      user = await this.authService.getUserByEmail(userInfo.email);
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
      const {
        token,
      } = await this.authThirdPartyService.registerUserByThirdParty({
        fullName: `${userInfo.name.firstName} ${userInfo.name.lastName}`,
        email: userInfo.email,
      });
      return res.redirect(`${REACT_APP_CLIENT_HOST}/verify-email/${token}`);
    }

    throw new InternalServerErrorException(
      ErrorTypes.THIRD_PARTY_AUTH_ERROR,
      `Something went wrong while authenticating using ${name}`,
    );
  }
}
