import bcrypt from 'bcryptjs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { AuthService } from '../services/auth.service';
import { UserProfile, UserTokenPayload } from '../interfaces/user.interface';
import { IsAuthenticated } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { LoginApiUserDto } from '../dto/login-api-user.dto';

@Controller({ path: 'auth/api', version: '1' })
@ApiTags('Auth API')
export class AuthApiController {
  constructor(private authService: AuthService) {}

  @Get('credentials')
  @ValidationBadRequest()
  @IsAuthenticated()
  @ApiOkResponse({
    type: UserProfile,
    description: `Signs in user. If it contains a header subdomain, it will be validated. If user's email is not verified an unauthorized error will be thrown. `,
  })
  @HttpCode(HttpStatus.OK)
  async getCredentials(@CurrentUser() user: UserTokenPayload) {
    const credentials = await this.authService.getApiCredentials(user.id);

    if (!credentials)
      return await this.authService.createApiCredentials(user.id);

    return credentials;
  }

  @Post('login')
  @ValidationBadRequest()
  @ApiNotFoundResponse({
    description: "Error thrown when user's api key or secret is invalid ",
    schema: errorResponseDoc(
      404,
      'Invalid api key or secret.',
      ErrorTypes.ERROR_API_KEY_OR_SECRET,
    ),
  })
  @ApiOkResponse({
    type: UserProfile,
    description: `Signs in api user and put tokens to response cookie and return user profile.`,
  })
  @HttpCode(HttpStatus.OK)
  async loginApiUser(
    @Body() loginApiUserDto: LoginApiUserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const user = await this.authService.getUserByApiKey(loginApiUserDto.apiKey);

    if (!user)
      throw new NotFoundException(
        ErrorTypes.ERROR_API_KEY_OR_SECRET,
        'There is no user related with requested api key.',
      );

    const validApiSecret = await bcrypt.compare(
      loginApiUserDto.apiSecret,
      user.apiSecret,
    );

    if (!validApiSecret)
      throw new NotFoundException(
        ErrorTypes.ERROR_API_KEY_OR_SECRET,
        'Invalid api secret for requested api key.',
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

    await this.authService.setAccessTokens(
      {
        id: user.id,
      },
      res,
      req,
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
    @Req() req: Request,
  ) {
    await this.authService.removeRefreshToken(user.id, user.refreshTokenId!);

    this.authService.removeAccessTokens(req, res);

    return 'OK';
  }
}
