import { Post } from 'entities/Post.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class PostVideoEntityChanges1634914644538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_video',
        columns: [
          ...recordEntityColumns,
          {
            name: 'slug',
            type: 'character varying',
          },
          {
            name: 'fileName',
            type: 'character varying',
          },
        ],
        uniques: [
          {
            name: 'post_video_slug_fileName_uniq',
            columnNames: ['slug', 'fileName'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'post_video',
      new TableForeignKey({
        columnNames: ['slug'],
        referencedColumnNames: ['slug'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );

    const recordings: Array<{
      id: number;
      postId: number;
      slug: string;
      createdOn: Date;
      fileName: string;
    }> = await queryRunner.query(
      'SELECT "meeting_recording"."id" as id, "post"."id" as "postId", "post"."slug" as "slug", "meeting_recording"."fileName" as "fileName", "meeting_recording"."createdOn" as createdOn  FROM "meeting_recording" inner join "post" on "post"."slug" = "meeting_recording"."meetingSlug" ',
    );

    for (const recording of recordings) {
      await queryRunner.query(
        'INSERT INTO post_video ("slug", "fileName") values ($1 , $2)',
        [recording.slug, recording.fileName],
      );
    }

    const videoPosts = await queryRunner.manager.find(Post, {
      where: { type: 'video' },
      select: ['slug', 'videoName', 'createdOn'],
    });

    for (const videoPost of videoPosts) {
      await queryRunner.query(
        'INSERT INTO post_video ("slug", "fileName") values ($1, $2)',
        [videoPost.slug, videoPost.videoName],
      );
    }

    await queryRunner.query(`DROP TABLE "meeting_recording" CASCADE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
