import { MigrationInterface, QueryRunner } from 'typeorm';
import { ChannelRole } from '../entities/ChannelRole.entity';
import { ChannelRoleCode, ZoneRoleCode } from '../types/RoleCodes';
import { ZoneRole } from '../entities/ZoneRole.entity';

export class ChannelAndZoneRoleColumnsFix1680294644386
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('channel_role', 'roleName');
    await queryRunner.dropColumn('channel_role', 'isSystemRole');

    const channelRoles = await queryRunner.manager.find(ChannelRole);

    for (const role of channelRoles) {
      let newRole;
      if (role.roleCode.toString() === 'SUPER_ADMIN')
        newRole = { roleCode: ChannelRoleCode.OWNER };
      else if (role.roleCode.toString() === 'ADMIN')
        newRole = { roleCode: ChannelRoleCode.MODERATOR };
      else if (role.roleCode.toString() === 'NORMAL')
        newRole = { roleCode: ChannelRoleCode.USER, canEdit: false };

      if (newRole)
        await queryRunner.manager.update(ChannelRole, { id: role.id }, newRole);
      else await queryRunner.manager.delete(ChannelRole, { id: role.id });
    }

    await queryRunner.dropColumn('zone_role', 'roleName');
    await queryRunner.dropColumn('zone_role', 'isSystemRole');

    const zoneRoles = await queryRunner.manager.find(ZoneRole);

    for (const role of zoneRoles) {
      let newRole;
      if (role.roleCode.toString() === 'SUPER_ADMIN')
        newRole = { roleCode: ZoneRoleCode.OWNER };
      else if (role.roleCode.toString() === 'ADMIN')
        newRole = { roleCode: ZoneRoleCode.MODERATOR };
      else if (role.roleCode.toString() === 'NORMAL')
        newRole = { roleCode: ZoneRoleCode.USER, canEdit: false };

      if (newRole)
        await queryRunner.manager.update(ZoneRole, { id: role.id }, newRole);
      else await queryRunner.manager.delete(ZoneRole, { id: role.id });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
