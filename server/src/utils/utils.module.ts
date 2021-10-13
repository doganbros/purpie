import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User.entity';
import { UtilsService } from './utils.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
