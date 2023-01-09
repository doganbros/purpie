import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class PostCommentLike1645634323730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_comment_like',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'postId',
            type: 'uuid',
          },
          {
            name: 'commentId',
            type: 'uuid',
          },
        ],
        uniques: [
          {
            name: 'post_comment_like_userId_postId_uniq',
            columnNames: ['userId', 'postId', 'commentId'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'post_comment_like',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'post_comment_like',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'post_comment_like',
      new TableForeignKey({
        columnNames: ['commentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_comment',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
