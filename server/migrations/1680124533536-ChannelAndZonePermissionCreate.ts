import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  baseChannelRoles,
  baseZoneRoles,
} from '../entities/data/default-roles';
import { ChannelPermission } from '../entities/ChannelPermission.entity';
import { ZonePermission } from '../entities/ZonePermission.entity';

export class ChannelAndZonePermissionCreate1680124533536
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'channel_permission',
        columns: [
          {
            name: 'roleCode',
            isPrimary: true,
            type: 'character varying',
          },
          {
            name: 'canInvite',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canDelete',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canEdit',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canManageRole',
            type: 'boolean',
            default: 'false',
          },
        ],
      }),
      true,
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(ChannelPermission)
      .values(baseChannelRoles)
      .execute();

    await queryRunner.createTable(
      new Table({
        name: 'zone_permission',
        columns: [
          {
            name: 'roleCode',
            isPrimary: true,
            type: 'character varying',
          },
          {
            name: 'canCreateChannel',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canInvite',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canDelete',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canEdit',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canManageRole',
            type: 'boolean',
            default: 'false',
          },
        ],
      }),
      true,
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(ZonePermission)
      .values(baseZoneRoles)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
