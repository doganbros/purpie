import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class NotificationReferences1656937155083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const notification = await queryRunner.getTable('notification');

    if (!notification) return;

    await queryRunner.addColumn(
      notification,
      new TableColumn({
        name: 'postLikeId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      notification,
      new TableColumn({
        name: 'postCommentLikeId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      notification,
      new TableForeignKey({
        columnNames: ['postLikeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_like',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      notification,
      new TableForeignKey({
        columnNames: ['postCommentLikeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_comment_like',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
