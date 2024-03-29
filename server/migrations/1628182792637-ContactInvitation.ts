import { baseMeetingConfig } from 'entities/data/base-meeting-config';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class ContactInvitation1628182792637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contact_invitation',
        columns: [
          ...recordEntityColumns,
          {
            name: 'inviteeId',
            type: 'uuid',
          },
          {
            name: 'inviterId',
            type: 'uuid',
          },
        ],
        uniques: [
          {
            name: 'contact_reqid_accid_unique_cols',
            columnNames: ['inviteeId', 'inviterId'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'contact_invitation',
      new TableForeignKey({
        columnNames: ['inviteeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'contact_invitation',
      new TableForeignKey({
        columnNames: ['inviterId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'public',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'config',
        type: 'text',
        default: `'${JSON.stringify(baseMeetingConfig)}'`,
      }),
    );
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'userMeetingConfig',
        type: 'text',
        default: `'${JSON.stringify(baseMeetingConfig)}'`,
      }),
    );

    await queryRunner.dropColumn('channel', 'defaultChannel');
    await queryRunner.dropColumn('zone', 'defaultZone');

    await queryRunner.changeColumn(
      'channel',
      'channelMeetingConfig',
      new TableColumn({
        name: 'channelMeetingConfig',
        type: 'text',
        default: `'${JSON.stringify(baseMeetingConfig)}'`,
      }),
    );

    const meeting = await queryRunner.getTable('meeting');
    if (meeting) {
      const foreignKey = meeting.foreignKeys.find((f) =>
        f.columnNames.includes('adminId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(meeting, foreignKey);

      await queryRunner.dropColumn(meeting, 'adminId');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE contact_invitation CASCADE;`);

    await queryRunner.addColumn(
      'channel',
      new TableColumn({
        name: 'defaultChannel',
        default: true,
        type: 'boolean',
      }),
    );
    await queryRunner.addColumn(
      'zone',
      new TableColumn({
        name: 'defaultZone',
        default: true,
        type: 'boolean',
      }),
    );
    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'adminId',
        type: 'uuid',
      }),
    );
    await queryRunner.createForeignKey(
      'meeting',
      new TableForeignKey({
        columnNames: ['adminId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.dropColumn('meeting', 'public');
    await queryRunner.dropColumn('meeting', 'config');
    await queryRunner.dropColumn('user', 'userMeetingConfig');
  }
}
