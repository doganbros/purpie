import { Channel } from 'entities/Channel.entity';
import { ChannelRole } from 'entities/ChannelRole.entity';
import {
  defaultChannelRoles,
  defaultZoneRoles,
} from 'entities/data/default-roles';
import { Zone } from 'entities/Zone.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class ChannelZoneRole1642937884729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user_zone = await queryRunner.getTable('user_zone');

    if (user_zone) {
      const foreignKey = user_zone.foreignKeys.find((f) =>
        f.columnNames.includes('zoneRoleCode'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(user_zone, foreignKey);
    }
    const user_channel = await queryRunner.getTable('user_channel');

    if (user_channel) {
      const foreignKey = user_channel.foreignKeys.find((f) =>
        f.columnNames.includes('channelRoleCode'),
      );
      if (foreignKey)
        await queryRunner.dropForeignKey(user_channel, foreignKey);
    }

    await queryRunner.dropPrimaryKey('zone_role');
    await queryRunner.dropPrimaryKey('channel_role');

    await queryRunner.addColumn(
      'zone_role',
      new TableColumn({
        name: 'id',
        type: 'int',
        isGenerated: true,
        isPrimary: true,
      }),
    );
    await queryRunner.addColumn(
      'channel_role',
      new TableColumn({
        name: 'id',
        type: 'int',
        isGenerated: true,
        isPrimary: true,
      }),
    );
    await queryRunner.addColumn(
      'zone_role',
      new TableColumn({
        name: 'zoneId',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'channel_role',
      new TableColumn({
        name: 'channelId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createUniqueConstraint(
      'channel_role',
      new TableUnique({ columnNames: ['roleCode', 'channelId'] }),
    );
    await queryRunner.createUniqueConstraint(
      'zone_role',
      new TableUnique({ columnNames: ['roleCode', 'zoneId'] }),
    );

    const zones = await queryRunner.manager.find(Zone, { select: ['id'] });

    for (const zone of zones) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(ZoneRole)
        .values(defaultZoneRoles.map((v) => ({ ...v, zoneId: zone.id })))
        .execute();
    }

    const channels = await queryRunner.manager.find(Channel, {
      select: ['id'],
    });

    for (const channel of channels) {
      await queryRunner.manager.insert(
        ChannelRole,
        defaultChannelRoles.map((v) => ({ ...v, channelId: channel.id })),
      );
    }

    await queryRunner.query('DELETE FROM zone_role WHERE "zoneId" is null');
    await queryRunner.query(
      'DELETE FROM channel_role WHERE "channelId" is null',
    );

    await queryRunner.createForeignKey(
      'zone_role',
      new TableForeignKey({
        columnNames: ['zoneId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'zone',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'channel_role',
      new TableForeignKey({
        columnNames: ['channelId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'channel',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(
      'ALTER TABLE zone_role ALTER COLUMN "zoneId" set NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE channel_role ALTER COLUMN "channelId" set NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
