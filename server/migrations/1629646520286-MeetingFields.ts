import { UserRole } from 'entities/UserRole.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class MeetingFields1629646520286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'meeting_attendance',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'meetingSlug',
            type: 'character varying',
          },
          {
            name: 'startDate',
            type: 'timestamp',
          },
          {
            name: 'endDate',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'meeting_attendance',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'meeting_attendance',
      new TableForeignKey({
        columnNames: ['meetingSlug'],
        referencedColumnNames: ['slug'],
        referencedTableName: 'meeting',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'user_role',
      new TableColumn({
        name: 'canSetRole',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.query(
      `UPDATE user_role SET "canSetRole" = true WHERE "roleCode" = 'SUPER_ADMIN'`,
    );

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'timeZone',
        type: 'character varying',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'conferenceStartDate',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'conferenceEndDate',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('meeting', 'timeZone');
    await queryRunner.dropColumn('meeting', 'conferenceStartDate');
    await queryRunner.dropColumn('meeting', 'conferenceEndDate');
    await queryRunner.query(`DROP TABLE meeting_attendance CASCADE;`);
  }
}
