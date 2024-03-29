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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeController,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import jwt from 'jsonwebtoken';
import { AuthByThirdPartyDto } from '../dto/auth-by-third-party.dto';
import { ThirdPartyLoginParams } from '../dto/third-party-login.params';
import { UserBasic, UserProfile } from '../interfaces/user.interface';
import { AuthThirdPartyService } from '../services/auth-third-party.service';
import { AuthService } from '../services/auth.service';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { ValidationBadRequest } from '../../utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from '../../../helpers/error-response-doc';
import { ParseTokenPipe } from '../pipes/parse-token.pipe';
import { MAIL_VERIFICATION_TYPE } from '../constants/auth.constants';
import { CompleteProfileDto } from '../dto/complete-profile.dto';

const {
  GOOGLE_OAUTH_CLIENT_ID = '',
  REACT_APP_CLIENT_HOST = '',
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URI,
  VERIFICATION_TOKEN_SECRET = '',
} = process.env;

@ApiExcludeController()
@Controller({ path: 'auth/third-party', version: '1' })
@ApiTags('Third Party Auth')
export class AuthThirdPartyController {
  constructor(
    private authService: AuthService,
    private authThirdPartyService: AuthThirdPartyService,
  ) {}

  @Get('/:name')
  @ApiParam({
    name: 'name',
    type: String,
    enum: ['google', 'apple'],
  })
  @ApiOkResponse({
    description: `User is redirected to a third-party auth url to sign in.`,
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
    enum: ['google', 'apple'],
  })
  @ApiOkResponse({
    type: UserProfile,
    description: `User signs in with a third-party. `,
  })
  @ApiInternalServerErrorResponse({
    description: 'Error thrown when requested third party name is invalid.',
    schema: errorResponseDoc(
      500,
      'Something went wrong while authenticating using "name"',
      'THIRD_PARTY_AUTH_ERROR',
    ),
  })
  @HttpCode(HttpStatus.OK)
  async authenticateByThirdParty(
    @Param() { name }: ThirdPartyLoginParams,
    @Body() body: AuthByThirdPartyDto,
    @Res({ passthrough: true }) res: Response,
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
        const token = await this.authService.setAccessTokens({
          id: user.id,
        });

        return {
          user: userPayload,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
      }
      const {
        token,
      } = await this.authThirdPartyService.registerUserByThirdParty({
        fullName: `${userInfo.given_name} ${userInfo.family_name}`,
        email: userInfo.email,
        googleId: userInfo.id,
      });
      return token;
    }
    if (name === 'apple') {
      if (body.email) {
        user = await this.authService.getUserByEmail(body.email);

        const userPayload: UserProfile = {
          id: user!.id,
          fullName: user!.fullName,
          email: user!.email,
          userName: user!.userName,
          userRole: {
            ...user!.userRole,
          },
        };
        const tokens = await this.authService.setAccessTokens({
          id: userPayload.id,
        });

        return {
          user: userPayload,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      }
      let userInfo;
      if (body.user) userInfo = JSON.parse(body.user);
      else if (body.id_token) {
        const idTokenPayload: any = jwt.decode(body.id_token);
        userInfo = { email: idTokenPayload?.email.toLowerCase() };
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      user = await this.authService.getUserByEmail(userInfo.email);
      if (user) {
        const stringifiedQuery = stringifyQuery({
          email: user.email,
        });
        return res.redirect(
          `${REACT_APP_CLIENT_HOST}/auth/apple?${stringifiedQuery}`,
        );
      }
      const {
        token,
      } = await this.authThirdPartyService.registerUserByThirdParty({
        fullName: `${userInfo.name.firstName} ${userInfo.name.lastName}`,
        email: userInfo.email.toLowerCase(),
      });
      return res.redirect(`${REACT_APP_CLIENT_HOST}/complete-profile/${token}`);
    }

    throw new InternalServerErrorException(
      ErrorTypes.THIRD_PARTY_AUTH_ERROR,
      `Something went wrong while authenticating using ${name}`,
    );
  }

  @Post('/profile/complete')
  @ValidationBadRequest()
  @ApiNotFoundResponse({
    description: 'Error thrown when user is not found',
    schema: errorResponseDoc(404, 'User not found', 'USER_NOT_FOUND'),
  })
  @ApiUnauthorizedResponse({
    description: 'Error thrown when JWT used to verify the email is invalid',
    schema: errorResponseDoc(
      401,
      'Email confirmation JWT is invalid',
      'INVALID_JWT',
    ),
  })
  @ApiCreatedResponse({
    type: UserProfile,
    description: `User complete profile which created with third party auth register.`,
  })
  @ApiBody({
    type: CompleteProfileDto,
  })
  async verifyUserEmail(
    @Body(
      'token',
      new ParseTokenPipe(
        VERIFICATION_TOKEN_SECRET,
        'Profile verification token is invalid',
        (payload) => payload.verificationType === MAIL_VERIFICATION_TYPE,
      ),
    )
    { email }: UserBasic,
    @Body() { token, userName }: CompleteProfileDto,
  ) {
    const user = await this.authService.verifyUserEmail(email, userName, token);

    const userPayload: UserProfile = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      userName: user.userName,
      userRole: {
        ...user.userRole,
      },
    };
    const {
      accessToken,
      refreshToken,
    } = await this.authService.setAccessTokens({
      id: user.id,
    });

    return { user: userPayload, accessToken, refreshToken };
  }
}
