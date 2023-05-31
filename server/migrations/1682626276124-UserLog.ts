import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class UserLog1682626276124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_log',
        columns: [
          ...recordEntityColumns,
          {
            name: 'createdById',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'channelId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'character varying',
          },
          {
            name: 'payload',
            type: 'character varying',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_log',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
