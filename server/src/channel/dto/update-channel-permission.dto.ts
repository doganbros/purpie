import { OmitType } from '@nestjs/swagger';
import { ChannelRole } from 'entities/ChannelRole.entity';

export class UpdateChannelPermission extends OmitType(ChannelRole, [
  'roleName',
  'isSystemRole',
] as const) {}
