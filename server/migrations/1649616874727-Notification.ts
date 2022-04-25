import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class Notification1649616874727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'message',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'createdById',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'character varying',
          },
          {
            name: 'readOn',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'notification',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'notification',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'notification',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
