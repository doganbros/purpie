import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class PostFolder1668969892227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP TABLE IF EXISTS playlist CASCADE;`);
    // await queryRunner.query(`DROP TABLE IF EXISTS playlist_item CASCADE;`);

    await queryRunner.createTable(
      new Table({
        name: 'post_folder',
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
            name: 'public',
            type: 'boolean',
            default: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'post_folder',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'post_folder_item',
        columns: [
          ...recordEntityColumns,
          {
            name: 'folderId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
        ],
        uniques: [
          {
            name: 'post_folder_item_unique_cols',
            columnNames: ['folderId', 'postId'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'post_folder_item',
      new TableForeignKey({
        columnNames: ['folderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_folder',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'post_folder_item',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE post_folder CASCADE;`);
    await queryRunner.query(`DROP TABLE post_folder_item CASCADE;`);
  }
}
