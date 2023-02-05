import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'entities/Client.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

@Injectable()
export class UtilService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async onModuleInit() {
    const clientApiKey = process.env.PURPIE_API_KEY;
    const clientApiSecret = process.env.PURPIE_API_SECRET;

    if (clientApiKey && clientApiSecret) {
      const existingClient = await this.clientRepository.findOne({
        where: {
          apiKey: clientApiKey,
        },
      });

      if (!existingClient) {
        const hashedSecret = await bcrypt.hash(clientApiSecret, 10);
        this.clientRepository
          .create({
            apiKey: clientApiKey,
            apiSecret: hashedSecret,
            name: 'Default Purpie Client',
            clientRoleCode: 'SUPER_ADMIN',
          })
          .save();
      }
    }
  }
}
