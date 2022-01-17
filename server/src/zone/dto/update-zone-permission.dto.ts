import { OmitType } from '@nestjs/swagger';
import { ZoneRole } from 'entities/ZoneRole.entity';

export class UpdateZonePermission extends OmitType(ZoneRole, [
  'roleName',
  'isSystemRole',
] as const) {}
