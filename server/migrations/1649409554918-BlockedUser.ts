import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class BlockedUser1649409554918 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'blocked_user',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'createdById',
            type: 'int',
          },
        ],
        uniques: [
          {
            name: 'blocked_user_userId_createdById',
            columnNames: ['userId', 'createdById'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'blocked_user',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'blocked_user',
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
