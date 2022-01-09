import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { IsAuthenticated } from '../decorators/auth.decorator';
import { IsClientAuthenticated } from '../decorators/client-auth.decorator';
import { CurrentClient } from '../decorators/current-client.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateClientDto } from '../dto/create-client.dto';
import { LoginClientDto } from '../dto/login-client.dto';
import { RefreshClientTokenDto } from '../dto/refresh-client-token.dto';
import {
  ClientApiCredential,
  ClientPayload,
  ClientTokens,
} from '../interfaces/client.interface';
import { UserTokenPayload } from '../interfaces/user.interface';

@Controller({ path: 'auth/client', version: '1' })
@ApiTags('auth-client')
export class ClientAuthController {
  constructor(private authService: AuthService) {}

  @Post('create')
  @IsAuthenticated(['canCreateClient'])
  @ApiCreatedResponse({
    type: ClientApiCredential,
    description:
      'Authorized user creates client and gets the api key and secret. Note: The secret is shown only this time.',
  })
  createNewClient(
    @Body() createClientInfo: CreateClientDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.authService.createClient(user.id, createClientInfo);
  }

  @Post('login')
  @ApiOkResponse({
    type: ClientTokens,
    description: `Signs in client and returns access and refresh token`,
  })
  loginClient(@Body() loginClientInfo: LoginClientDto) {
    return this.authService.authenticateClient(loginClientInfo);
  }

  @Post('logout')
  @IsClientAuthenticated()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: { type: 'string', example: 'OK' },
  })
  async logout(@CurrentClient() currentClient: ClientPayload) {
    await this.authService.removeClientRefreshToken(currentClient.id);

    return 'OK';
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ClientTokens,
    description:
      'Authorized client retrieves access token and refresh token. Note: The secret is shown only this time.',
  })
  refreshClientToken(@Body() refreshTokenInfo: RefreshClientTokenDto) {
    return this.authService.refreshClientTokens(refreshTokenInfo.refreshToken);
  }

  @Get('retrieve')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ClientPayload,
    description: 'Authorized client information.',
  })
  @IsClientAuthenticated()
  retrieveClient(@CurrentClient() currentClient: ClientPayload) {
    return currentClient;
  }
}
