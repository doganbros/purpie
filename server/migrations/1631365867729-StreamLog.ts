import { ClientRole } from 'entities/ClientRole.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class StreamLog1631365867729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stream_log',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'slug',
            type: 'character varying',
          },
          {
            name: 'event',
            type: 'character varying',
          },
          {
            name: 'mediaType',
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
      'stream_log',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'client_role',
      new TableColumn({
        name: 'manageStream',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.manager.update(
      ClientRole,
      { roleCode: 'SUPER_ADMIN' },
      { manageStream: true },
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
