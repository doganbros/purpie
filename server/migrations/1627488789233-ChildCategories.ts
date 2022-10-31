import { ChannelRole } from 'entities/ChannelRole.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ChildCategories1627488789233 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invitation',
      new TableColumn({
        name: 'createdById',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'invitation',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'zone_role',
      new TableColumn({
        name: 'canDelete',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.addColumn(
      'zone_role',
      new TableColumn({
        name: 'canEdit',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'channel_role',
      new TableColumn({
        name: 'canDelete',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.addColumn(
      'channel_role',
      new TableColumn({
        name: 'canEdit',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.manager.update(
      ZoneRole,
      { roleCode: 'SUPER_ADMIN' },
      { canDelete: true },
    );
    await queryRunner.manager.update(
      ChannelRole,
      { roleCode: 'SUPER_ADMIN' },
      { canDelete: true },
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const invitation = await queryRunner.getTable('invitation');

    if (invitation) {
      const foreignKey = invitation.foreignKeys.find((f) =>
        f.columnNames.includes('createdById'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(invitation, foreignKey);

      await queryRunner.dropColumn(invitation, 'createdById');
    }

    await queryRunner.dropColumn('zone_role', 'canEdit');
    await queryRunner.dropColumn('channel_role', 'canEdit');
    await queryRunner.dropColumn('zone_role', 'canDelete');
    await queryRunner.dropColumn('channel_role', 'canDelete');

    await queryRunner.manager.update(
      ZoneRole,
      { roleCode: 'SUPER_ADMIN' },
      { canDelete: false },
    );
    await queryRunner.manager.update(
      ChannelRole,
      { roleCode: 'SUPER_ADMIN' },
      { canDelete: false },
    );
  }
}
