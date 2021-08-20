import { Body, Controller, Get, Post } from '@nestjs/common';
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
import { UserPayload } from '../interfaces/user.interface';

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
    @CurrentUser() user: UserPayload,
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

  @Post('/logout')
  @IsClientAuthenticated()
  async logout(@CurrentClient() currentClient: ClientPayload) {
    await this.authService.removeClientRefreshToken(currentClient.id);

    return 'OK';
  }

  @Post('refresh-token')
  refreshClientToken(@Body() refreshTokenInfo: RefreshClientTokenDto) {
    return this.authService.refreshClientTokens(refreshTokenInfo.refreshToken);
  }

  @Get('retrieve')
  @IsClientAuthenticated()
  retrieveClient(@CurrentClient() currentClient: ClientPayload) {
    return currentClient;
  }
}
