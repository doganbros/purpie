import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class ProfileItems1660239572704 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'featured_post',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
        ],
        uniques: [
          {
            name: 'featured_post_unique_cols',
            columnNames: ['userId', 'postId'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'featured_post',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'featured_post',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'playlist',
        columns: [
          ...recordEntityColumns,
          {
            name: 'title',
            type: 'character varying',
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
            default: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'playlist',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'playlist',
      new TableForeignKey({
        columnNames: ['channelId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'channel',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'playlist_item',
        columns: [
          ...recordEntityColumns,
          {
            name: 'playlistId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
        ],
        uniques: [
          {
            name: 'playlist_item_unique_cols',
            columnNames: ['playlistId', 'postId'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'playlist_item',
      new TableForeignKey({
        columnNames: ['playlistId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'playlist',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'playlist_item',
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
