import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class ChatMessage1647124213356 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat_message',
        columns: [
          ...recordEntityColumns,
          {
            name: 'parentId',
            type: 'int',
          },
          {
            name: 'medium',
            type: 'character varying',
            default: 'direct',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
