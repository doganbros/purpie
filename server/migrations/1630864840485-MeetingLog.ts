import { User } from 'entities/User.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class MeetingLog1630864840485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'meeting_log',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'meetingSlug',
            type: 'character varying',
          },
          {
            name: 'event',
            type: 'character varying',
          },
          {
            name: 'extraInfo',
            type: 'character varying',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'meeting_log',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'meeting_log',
      new TableForeignKey({
        columnNames: ['meetingSlug'],
        referencedColumnNames: ['slug'],
        referencedTableName: 'meeting',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'userName',
        type: 'character varying',
        isNullable: true,
        isUnique: true,
      }),
    );

    const users = await queryRunner.manager.find(User);

    for (const { firstName, lastName, id } of users) {
      const userName = `${firstName} ${lastName}`
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/ö/g, 'o')
        .replace(/ı/g, 'i')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u');

      await queryRunner.manager.update(User, { id }, { userName });
    }
    await queryRunner.query(`DROP TABLE meeting_attendance CASCADE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'userName');
    await queryRunner.query(`DROP TABLE meeting_log CASCADE;`);
  }
}
