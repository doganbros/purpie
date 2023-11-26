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
import {
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { AuthService } from '../services/auth.service';
import {
  AuthenticationTokens,
  UserApiCredentials,
  UserTokenPayload,
} from '../interfaces/user.interface';
import { IsAuthenticated } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { LoginApiUserDto } from '../dto/login-api-user.dto';

@Controller({ path: 'auth/api', version: '1' })
@ApiTags('Auth')
export class AuthApiController {
  constructor(private authService: AuthService) {}

  @Post('generate')
  @ApiExcludeEndpoint()
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
  @ApiExcludeEndpoint()
  @ApiOkResponse({
    description: `Signs in api user. If user's email is not verified an unauthorized error will be thrown. `,
  })
  @HttpCode(HttpStatus.OK)
  async getCredentials(@CurrentUser() user: UserTokenPayload) {
    return this.authService.getApiCredentials(user.id);
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
    type: AuthenticationTokens,
    description: `Signs in user and return tokens.`,
  })
  @ApiOperation({
    summary: 'Login',
    description:
      'Generate access and refresh tokens with requested API credentials for accessing protected service endpoints.',
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
  @ApiOperation({
    summary: 'Logout',
    description:
      'Invalidate tokens which generated from login call and logout to requested user.',
  })
  async logout(@CurrentUser() user: UserTokenPayload) {
    await this.authService.removeRefreshToken(user.id, user.refreshTokenId!);

    return 'OK';
  }
}
