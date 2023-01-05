import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class ChatMessageAttachment1652816252349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat_message_attachment',
        columns: [
          ...recordEntityColumns,
          {
            name: 'chatMessageId',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'character varying',
          },
          {
            name: 'createdById',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'chat_message_attachment',
      new TableForeignKey({
        columnNames: ['chatMessageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'chat_message',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'chat_message_attachment',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
