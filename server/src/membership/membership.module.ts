import { Module } from '@nestjs/common';
import { MembershipController } from './controllers/MembershipController';
import { MembershipService } from './services/membership.service';

@Module({
  controllers: [MembershipController],
  imports: [],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
