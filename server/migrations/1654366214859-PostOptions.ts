import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PostOptions1654366214859 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'private',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'allowReaction',
        type: 'boolean',
        default: true,
      }),
    );
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'allowComment',
        type: 'boolean',
        default: true,
      }),
    );
    await queryRunner.addColumn(
      'post_like',
      new TableColumn({
        name: 'positive',
        type: 'boolean',
        default: true,
      }),
    );
    await queryRunner.addColumn(
      'post_reaction',
      new TableColumn({
        name: 'dislikesCount',
        type: 'int',
        default: 0,
      }),
    );

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION update_post_reaction_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            UPDATE "post_reaction" 
                SET "likesCount" = (SELECT COUNT(*) FROM post_like WHERE ("post_like"."positive" = true) and ("post_like"."postId" = "new"."postId" or "post_like"."postId" = "old"."postId") ),
                    "dislikesCount" = (SELECT COUNT(*) FROM post_like WHERE ("post_like"."positive" = false) and ("post_like"."postId" = "new"."postId" or "post_like"."postId" = "old"."postId") ),
                    "commentsCount" = (SELECT COUNT(*) FROM post_comment WHERE "post_comment"."postId" = "new"."postId" or "post_comment"."postId" = "old"."postId")

            WHERE 
                "post_reaction"."postId" = "old"."postId" or "post_reaction"."postId" = "new"."postId";
            RETURN NULL;
        END;
        $$  LANGUAGE plpgsql
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
