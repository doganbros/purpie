import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PostFolderItemCount1670962504798 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'post_folder',
      new TableColumn({
        name: 'itemCount',
        type: 'int',
        default: 0,
      }),
    );
    await queryRunner.dropColumn('post_folder', 'public');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
