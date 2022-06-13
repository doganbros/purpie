import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class NotificationExtra1654529782402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'notification',
      new TableColumn({
        name: 'postCommentId',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'notification',
      new TableColumn({
        name: 'viewedOn',
        type: 'timestamp',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'notification',
      new TableForeignKey({
        columnNames: ['postCommentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_comment',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
