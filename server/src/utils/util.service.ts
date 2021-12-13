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
    const octopusClientApiKey = process.env.OCTOPUS_API_KEY;
    const octopusClientApiSecret = process.env.OCTOPUS_API_SECRET;

    if (octopusClientApiKey && octopusClientApiSecret) {
      const existingClient = await this.clientRepository.findOne({
        where: {
          apiKey: octopusClientApiKey,
        },
      });

      if (!existingClient) {
        const hashedSecret = await bcrypt.hash(octopusClientApiSecret, 10);
        this.clientRepository
          .create({
            apiKey: octopusClientApiKey,
            apiSecret: hashedSecret,
            name: 'Default Octopus Client',
            clientRoleCode: 'SUPER_ADMIN',
          })
          .save();
      }
    }
  }
}
