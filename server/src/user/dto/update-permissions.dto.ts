import { OmitType } from '@nestjs/swagger';
import { UserRole } from 'entities/UserRole.entity';

export class UpdateUserPermission extends OmitType(UserRole, [
  'roleName',
  'isSystemRole',
] as const) {}
