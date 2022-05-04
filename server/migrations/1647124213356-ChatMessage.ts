import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class ChatMessage1647124213356 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP COLUMN IF EXISTS "mattermostId";
    `);

    await queryRunner.createTable(
      new Table({
        name: 'chat_message',
        columns: [
          ...recordEntityColumns,
          {
            name: 'identifier',
            isUnique: true,
            type: 'character varying',
          },
          {
            name: 'parentIdentifier',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'medium',
            type: 'character varying',
            default: "'direct'",
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'readOn',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isSystemMessage',
            type: 'boolean',
            default: false,
          },
          {
            name: 'edited',
            type: 'boolean',
            default: false,
          },
          {
            name: 'deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'to',
            type: 'int',
          },
          {
            name: 'createdById',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'chat_message',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'chat_message',
      new TableForeignKey({
        columnNames: ['parentIdentifier'],
        referencedColumnNames: ['identifier'],
        referencedTableName: 'chat_message',
        onDelete: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
