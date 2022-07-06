import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Client } from 'entities/Client.entity';
import { alphaNum, compareHash, hash } from 'helpers/utils';
import { verifyJWT } from 'helpers/jwt';
import { customAlphabet } from 'nanoid';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateClientDto } from '../dto/create-client.dto';
import { LoginClientDto } from '../dto/login-client.dto';
import { OCTOPUS_CLIENT_AUTH_TYPE } from '../constants/auth.constants';
import { AuthService } from './auth.service';

const { AUTH_TOKEN_SECRET_REFRESH = '' } = process.env;

@Injectable()
export class ClientAuthService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private authService: AuthService,
  ) {}

  async createClient(userId: number, createClientInfo: CreateClientDto) {
    const apiKey = customAlphabet(alphaNum, 50)();
    const apiSecret = customAlphabet(alphaNum, 70)();

    const apiSecretHashed = await bcrypt.hash(apiSecret, 10);

    await this.clientRepository
      .create({
        apiKey,
        apiSecret: apiSecretHashed,
        name: createClientInfo.name,
        clientRoleCode: createClientInfo.roleCode,
        createdById: userId,
      })
      .save();
    return {
      apiKey,
      apiSecret,
    };
  }

  async authenticateClient(info: LoginClientDto) {
    const client = await this.clientRepository.findOne({
      where: { apiKey: info.apiKey },
      relations: ['clientRole'],
    });

    if (!client)
      throw new NotFoundException(
        'Wrong client apiKey or apiSecret',
        'WRONG_CLIENT_API_KEY_OR_SECRET',
      );

    const isValid = await bcrypt.compare(info.apiSecret, client.apiSecret);

    if (!isValid)
      throw new NotFoundException(
        'Wrong client apiKey or apiSecret',
        'WRONG_CLIENT_API_KEY_OR_SECRET',
      );

    const tokens = await this.authService.generateLoginToken({
      id: client.id,
      name: client.name,
      clientRole: client.clientRole,
      authType: OCTOPUS_CLIENT_AUTH_TYPE,
    });

    client.refreshToken = await hash(tokens.refreshToken);
    await client.save();

    return tokens;
  }

  async refreshClientTokens(refreshToken: string) {
    try {
      const payload = await verifyJWT(refreshToken, AUTH_TOKEN_SECRET_REFRESH);

      const client = await this.clientRepository.findOneOrFail({
        where: { id: payload.id, refreshToken: Not(IsNull()) },
        relations: ['clientRole'],
      });

      const isValid = await compareHash(refreshToken, client.refreshToken!);

      if (!isValid) throw new Error('Not Valid');

      const tokens = await this.authService.generateLoginToken({
        id: client.id,
        name: client.name,
        clientRole: client.clientRole,
        authType: OCTOPUS_CLIENT_AUTH_TYPE,
      });
      client.refreshToken = await hash(tokens.refreshToken);
      await client.save();
      return tokens;
    } catch (err: any) {
      throw new UnauthorizedException(
        'Invalid Refresh Token',
        'INVALID_REFRESH_TOKEN',
      );
    }
  }

  async removeClientRefreshToken(id: number) {
    await this.clientRepository.update(id, { refreshToken: null });
  }
}
