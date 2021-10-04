import { Post } from 'entities/Post.entity';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PostChanges1633352585656 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'post',
      'telecastRepeatUrl',
      new TableColumn({
        name: 'videoName',
        type: 'character varying',
        isNullable: true,
      }),
    );

    await queryRunner.manager.delete(Post, { type: 'video' });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
