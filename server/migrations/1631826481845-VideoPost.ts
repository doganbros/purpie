import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class VideoPost1631826481845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'streaming',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'telecastRepeatUrl',
        type: 'character varying',
        isNullable: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'video_post',
        columns: [
          ...recordEntityColumns,
          {
            name: 'title',
            type: 'character varying',
          },
          {
            name: 'description',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'slug',
            type: 'character varying',
            isUnique: true,
          },
          {
            name: 'createdById',
            type: 'int',
          },
          {
            name: 'channelId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'public',
            type: 'boolean',
            default: false,
          },
          {
            name: 'userContactExclusive',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'video_post',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'video_post',
      new TableForeignKey({
        columnNames: ['channelId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'channel',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
