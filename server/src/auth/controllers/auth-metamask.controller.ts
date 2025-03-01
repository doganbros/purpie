import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { AuthMetamaskService } from '../services/auth-metamask.service';
import { MetamaskLoginDto } from '../dto/metamask-login.dto';
import { MetamaskRegisterDto } from '../dto/metamask-register.dto';
import { MetamaskNonceDto } from '../dto/metamask-nonce.dto';

@Controller({ path: 'auth/metamask', version: '1' })
@ApiTags('Auth Metamask')
export class AuthMetamaskController {
  constructor(private authMetamaskService: AuthMetamaskService) {}

  @Post('nonce')
  @ApiOkResponse({
    description: 'Returns a nonce for the wallet address',
    schema: {
      type: 'object',
      properties: {
        nonce: {
          type: 'string',
          example: 'abcdef123456',
        },
      },
    },
  })
  @ValidationBadRequest()
  @HttpCode(HttpStatus.OK)
  async getNonce(
    @Body(ValidationPipe) metamaskNonceDto: MetamaskNonceDto,
  ): Promise<{ nonce: string }> {
    const nonce = await this.authMetamaskService.generateNonce(
      metamaskNonceDto.walletAddress,
    );
    return { nonce };
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User login with Metamask wallet',
  })
  @ApiUnauthorizedResponse({
    description: 'Error thrown when signature is invalid',
    schema: errorResponseDoc(401, 'Invalid signature', 'INVALID_SIGNATURE'),
  })
  @ValidationBadRequest()
  @HttpCode(HttpStatus.OK)
  async loginWithMetamask(
    @Body(ValidationPipe) metamaskLoginDto: MetamaskLoginDto,
  ) {
    return this.authMetamaskService.loginWithMetamask(metamaskLoginDto);
  }

  @Post('register')
  @ApiCreatedResponse({
    description:
      'User register with Metamask wallet. Sends verification email.',
  })
  @ValidationBadRequest()
  async registerWithMetamask(
    @Body(ValidationPipe) metamaskRegisterDto: MetamaskRegisterDto,
  ) {
    return this.authMetamaskService.registerWithMetamask(metamaskRegisterDto);
  }
}
