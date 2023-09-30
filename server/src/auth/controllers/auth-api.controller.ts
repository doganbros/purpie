import bcrypt from 'bcryptjs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { AuthService } from '../services/auth.service';
import {
  UserApiCredentials,
  UserProfile,
  UserTokenPayload,
} from '../interfaces/user.interface';
import { IsAuthenticated } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { LoginApiUserDto } from '../dto/login-api-user.dto';

@Controller({ path: 'auth/api', version: '1' })
@ApiTags('Auth API')
export class AuthApiController {
  constructor(private authService: AuthService) {}

  @Post('generate')
  @IsAuthenticated()
  @ApiOkResponse({
    type: UserApiCredentials,
    description: 'Create Api key and secret for authenticated user',
  })
  @HttpCode(HttpStatus.OK)
  async createCredentials(@CurrentUser() user: UserTokenPayload) {
    return this.authService.createApiCredentials(user.id);
  }

  @Get('credentials')
  @IsAuthenticated()
  @ApiOkResponse({
    description: `Signs in api user. If user's email is not verified an unauthorized error will be thrown. `,
  })
  @ApiNotFoundResponse({
    description:
      "Error thrown when user's api key or secret is not exist for user ",
    schema: errorResponseDoc(
      404,
      'User api key not exist.',
      ErrorTypes.USER_API_CREDENTIALS_NOT_EXIST,
    ),
  })
  @HttpCode(HttpStatus.OK)
  async getCredentials(@CurrentUser() user: UserTokenPayload) {
    const credentials = await this.authService.getApiCredentials(user.id);

    if (!credentials)
      throw new NotFoundException(
        'User api key not exist',
        ErrorTypes.USER_API_CREDENTIALS_NOT_EXIST,
      );

    return credentials;
  }

  @Post('authorize')
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
  async loginApiUser(@Body() loginApiUserDto: LoginApiUserDto) {
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

    const {
      accessToken,
      refreshToken,
    } = await this.authService.setAccessTokens({
      id: user.id,
    });

    return { accessToken, refreshToken };
  }

  @Post('/logout')
  @IsAuthenticated([], { removeAccessTokens: true })
  @ApiOkResponse({ schema: { type: 'string', example: 'OK' } })
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: UserTokenPayload) {
    await this.authService.removeRefreshToken(user.id, user.refreshTokenId!);

    return 'OK';
  }
}
