/* eslint-disable @typescript-eslint/naming-convention */
import { Category } from 'entities/Category.entity';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { UserRole } from 'entities/UserRole.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class SchemaChanges1626633791984 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_role',
        columns: [
          {
            name: 'roleCode',
            type: 'character varying',
            isPrimary: true,
          },
          {
            name: 'roleName',
            type: 'character varying',
          },
          {
            name: 'canCreateZone',
            type: 'boolean',
            default: 'true',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'zone_role',
        columns: [
          {
            name: 'roleCode',
            isPrimary: true,
            type: 'character varying',
          },
          {
            name: 'roleName',
            type: 'character varying',
          },
          {
            name: 'canInvite',
            type: 'boolean',
            default: 'true',
          },
          {
            name: 'canCreateChannel',
            type: 'boolean',
            default: 'true',
          },
        ],
      }),
      true,
    );
    await queryRunner.createTable(
      new Table({
        name: 'channel_role',
        columns: [
          {
            name: 'roleCode',
            type: 'character varying',
            isPrimary: true,
          },
          {
            name: 'roleName',
            type: 'character varying',
          },
          {
            name: 'canInvite',
            type: 'boolean',
            default: 'true',
          },
        ],
      }),
      true,
    );
    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'character varying',
          },
          {
            name: 'parentCategoryId',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'category',
      new TableForeignKey({
        columnNames: ['parentCategoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'RESTRICT',
      }),
    );

    const roleSeeds =  `
      INSERT INTO user_role ("roleName", "roleCode", "canCreateZone")
      values
      ('Super Admin', 'SUPER_ADMIN', true),
      ('Admin', 'ADMIN', true),
      ('Normal', 'NORMAL', true);


      INSERT INTO zone_role ("roleName", "roleCode", "canCreateChannel", "canInvite")
      values
      ('Super Admin', 'SUPER_ADMIN', true, true),
      ('Admin', 'ADMIN', true, true),
      ('Editor', 'EDITOR', true, true),
      ('Normal', 'NORMAL', true, false);

      INSERT INTO channel_role ("roleName", "roleCode", "canInvite")
      values
      ('Super Admin', 'SUPER_ADMIN', true),
      ('Admin', 'ADMIN', true),
      ('Editor', 'EDITOR', true),
      ('Normal', 'NORMAL', true);
    `;

    await queryRunner.query(roleSeeds);


    await queryRunner.manager.insert(Category, [
      {
        name: 'Film & Animation',
      },
      {
        name: 'Autos & Vehicles',
      },
      {
        name: 'Music',
      },
      {
        name: 'Pets & Animals',
      },
      {
        name: 'Sports',
      },
      {
        name: 'Travel & Events',
      },
      {
        name: 'Gaming',
      },
      {
        name: 'People & Blogs',
      },
      {
        name: 'Comedy',
      },
      {
        name: 'Entertainment',
      },
      {
        name: 'News & Politics',
      },
      {
        name: 'Howto & Style',
      },
      {
        name: 'Education',
      },
      {
        name: 'Science & Technology',
      },
      {
        name: 'Nonprofits & Activism',
      },
      {
        name: 'Other',
      },
    ]);

    const user = await queryRunner.getTable('user');

    if (user) {
      await queryRunner.addColumn(
        user,
        new TableColumn({
          name: 'userRoleCode',
          type: 'character varying',
        }),
      );

      await queryRunner.createForeignKey(
        user,
        new TableForeignKey({
          columnNames: ['userRoleCode'],
          referencedColumnNames: ['roleCode'],
          referencedTableName: 'user_role',
          onDelete: 'RESTRICT',
        }),
      );
    }

    const invitation = await queryRunner.getTable('invitation');

    if (invitation) {
      const foreignKey = invitation.foreignKeys.find((f) =>
        f.columnNames.includes('userId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(invitation, foreignKey);

      await queryRunner.dropColumn(invitation, 'userId');

      await queryRunner.addColumn(
        invitation,
        new TableColumn({
          name: 'email',
          type: 'character varying',
        }),
      );
    }

    const zone = await queryRunner.getTable('zone');

    if (zone) {
      const foreignKey = zone.foreignKeys.find((f) =>
        f.columnNames.includes('adminId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(zone, foreignKey);

      await queryRunner.dropColumn(zone, 'adminId');

      await queryRunner.addColumn(
        zone,
        new TableColumn({
          name: 'defaultZone',
          default: true,
          type: 'boolean',
        }),
      );
      await queryRunner.addColumn(
        zone,
        new TableColumn({
          name: 'categoryId',
          type: 'int',
        }),
      );
      await queryRunner.createForeignKey(
        zone,
        new TableForeignKey({
          columnNames: ['categoryId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'category',
          onDelete: 'RESTRICT',
        }),
      );
    }

    const channel = await queryRunner.getTable('channel');

    if (channel) {
      const foreignKey = channel.foreignKeys.find((f) =>
        f.columnNames.includes('adminId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(channel, foreignKey);

      await queryRunner.dropColumn(channel, 'adminId');

      await queryRunner.addColumn(
        channel,
        new TableColumn({
          name: 'defaultChannel',
          default: true,
          type: 'boolean',
        }),
      );
      await queryRunner.addColumn(
        channel,
        new TableColumn({
          name: 'categoryId',
          type: 'int',
        }),
      );
      await queryRunner.createForeignKey(
        channel,
        new TableForeignKey({
          columnNames: ['categoryId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'category',
          onDelete: 'RESTRICT',
        }),
      );
    }

    const user_zone = await queryRunner.getTable('user_zone');

    if (user_zone) {
      const foreignKey = user_zone.foreignKeys.find((f) =>
        f.columnNames.includes('userZonePermissionId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(user_zone, foreignKey);

      await queryRunner.dropColumn(user_zone, 'userZonePermissionId');

      await queryRunner.addColumn(
        user_zone,
        new TableColumn({
          name: 'zoneRoleCode',
          type: 'character varying',
        }),
      );

      await queryRunner.createForeignKey(
        user_zone,
        new TableForeignKey({
          columnNames: ['zoneRoleCode'],
          referencedColumnNames: ['roleCode'],
          referencedTableName: 'zone_role',
          onDelete: 'RESTRICT',
        }),
      );

      await queryRunner.dropTable('user_zone_permission', true);
    }

    const user_channel = await queryRunner.getTable('user_channel');

    if (user_channel) {
      const foreignKey = user_channel.foreignKeys.find((f) =>
        f.columnNames.includes('userChannelPermissionId'),
      );
      if (foreignKey)
        await queryRunner.dropForeignKey(user_channel, foreignKey);

      await queryRunner.dropColumn(user_channel, 'userChannelPermissionId');

      await queryRunner.addColumn(
        user_channel,
        new TableColumn({
          name: 'channelRoleCode',
          type: 'character varying',
        }),
      );

      await queryRunner.createForeignKey(
        user_channel,
        new TableForeignKey({
          columnNames: ['channelRoleCode'],
          referencedColumnNames: ['roleCode'],
          referencedTableName: 'channel_role',
          onDelete: 'RESTRICT',
        }),
      );

      await queryRunner.dropTable('user_channel_permission', true);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const user_channel = await queryRunner.getTable('user_channel');

    if (user_channel) {
      await queryRunner.createTable(
        new Table({
          name: 'user_channel_permission',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
            },
            {
              name: 'canAddUser',
              type: 'boolean',
              default: 'false',
            },
            {
              name: 'canContribute',
              type: 'boolean',
              default: 'false',
            },
          ],
        }),
        true,
      );

      const foreignKey = user_channel.foreignKeys.find((f) =>
        f.columnNames.includes('channelRoleCode'),
      );
      if (foreignKey)
        await queryRunner.dropForeignKey(user_channel, foreignKey);

      await queryRunner.dropColumn(user_channel, 'channelRoleCode');
      await queryRunner.addColumn(
        user_channel,
        new TableColumn({
          name: 'userChannelPermissionId',
          type: 'int',
        }),
      );
      await queryRunner.createForeignKey(
        user_channel,
        new TableForeignKey({
          columnNames: ['userChannelPermissionId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user_channel_permission',
          onDelete: 'RESTRICT',
        }),
      );
    }

    const user_zone = await queryRunner.getTable('user_zone');

    if (user_zone) {
      await queryRunner.createTable(
        new Table({
          name: 'user_zone_permission',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
            },
            {
              name: 'canCreateChannel',
              type: 'boolean',
              default: 'false',
            },
            {
              name: 'canAddUser',
              type: 'boolean',
              default: 'false',
            },
          ],
        }),
        true,
      );

      const foreignKey = user_zone.foreignKeys.find((f) =>
        f.columnNames.includes('zoneRoleCode'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(user_zone, foreignKey);

      await queryRunner.dropColumn(user_zone, 'zoneRoleCode');
      await queryRunner.addColumn(
        user_zone,
        new TableColumn({
          name: 'userZonePermissionId',
          type: 'int',
        }),
      );
      await queryRunner.createForeignKey(
        user_zone,
        new TableForeignKey({
          columnNames: ['userZonePermissionId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user_zone_permission',
          onDelete: 'RESTRICT',
        }),
      );
    }

    const channel = await queryRunner.getTable('channel');

    if (channel) {
      const foreignKey = channel.foreignKeys.find((f) =>
        f.columnNames.includes('categoryId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(channel, foreignKey);

      await queryRunner.dropColumn(channel, 'categoryId');
      await queryRunner.dropColumn(channel, 'defaultChannel');
    }

    const zone = await queryRunner.getTable('zone');

    if (zone) {
      const foreignKey = zone.foreignKeys.find((f) =>
        f.columnNames.includes('categoryId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(zone, foreignKey);

      await queryRunner.dropColumn(zone, 'categoryId');
      await queryRunner.dropColumn(zone, 'defaultZone');
    }

    const invitation = await queryRunner.getTable('invitation');

    if (invitation) {
      await queryRunner.dropColumn(invitation, 'email');

      await queryRunner.addColumn(
        invitation,
        new TableColumn({
          name: 'userId',
          type: 'int',
        }),
      );

      await queryRunner.createForeignKey(
        invitation,
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'RESTRICT',
        }),
      );
    }

    const category = await queryRunner.getTable('category');

    if (category) {
      const foreignKey = category.foreignKeys.find((f) =>
        f.columnNames.includes('parentCategoryId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(category, foreignKey);
    }

    const user = await queryRunner.getTable('user');

    if (user) {
      const foreignKey = user.foreignKeys.find((f) =>
        f.columnNames.includes('userRoleCode'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(user, foreignKey);

      await queryRunner.dropColumn(user, 'userRoleCode');
    }

    await queryRunner.dropTable('zone_role', true);
    await queryRunner.dropTable('channel_role', true);
    await queryRunner.dropTable('user_role', true);
    await queryRunner.dropTable('category', true);
  }
}
