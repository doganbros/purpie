import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class PostReaction1641815577475 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_reaction',
        columns: [
          ...recordEntityColumns,
          {
            name: 'likesCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'commentsCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'postId',
            type: 'int',
            isUnique: true,
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'post_reaction',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'postReactionId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'post',
      new TableForeignKey({
        columnNames: ['postReactionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_reaction',
        onDelete: 'CASCADE',
      }),
    );

    const posts = await queryRunner.query(
      'SELECT id, "likesCount", "commentsCount" FROM "post"',
    );

    for (const post of posts) {
      await queryRunner.query(
        'INSERT INTO post_reaction ("postId", "commentsCount", "likesCount") values ($1 ,$2, $3)',
        [post.id, post.commentsCount, post.likesCount],
      );
    }

    const postReactions = await queryRunner.query(
      'SELECT id, "postId" FROM "post_reaction"',
    );

    for (const postReaction of postReactions) {
      await queryRunner.query(
        'UPDATE post SET "postReactionId" = $1 WHERE id = $2',
        [postReaction.id, postReaction.postId],
      );
    }

    await queryRunner.query(
      'DROP TRIGGER IF EXISTS post_update_comments_trigger ON "post_comment" CASCADE;',
    );
    await queryRunner.query(
      'DROP TRIGGER IF EXISTS post_update_likes_trigger ON "post_like" CASCADE;',
    );

    await queryRunner.query(`
        CREATE FUNCTION update_post_reaction_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            UPDATE "post_reaction" 
                SET "likesCount" = (SELECT COUNT(*) FROM post_like WHERE "post_like"."postId" = "new"."postId" or "post_like"."postId" = "old"."postId"),
                    "commentsCount" = (SELECT COUNT(*) FROM post_comment WHERE "post_comment"."postId" = "new"."postId" or "post_comment"."postId" = "old"."postId")

            WHERE 
                "post_reaction"."postId" = "old"."postId" or "post_reaction"."postId" = "new"."postId";
            RETURN NULL;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.query(
      'CREATE TRIGGER post_update_likes_trigger AFTER INSERT OR UPDATE OR DELETE ON "post_like" FOR EACH ROW EXECUTE PROCEDURE update_post_reaction_func()',
    );
    await queryRunner.query(
      'CREATE TRIGGER post_update_comments_trigger AFTER INSERT OR UPDATE OR DELETE ON "post_comment" FOR EACH ROW EXECUTE PROCEDURE update_post_reaction_func()',
    );

    await queryRunner.query(`
        CREATE FUNCTION create_post_reaction_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
          INSERT INTO post_reaction ("postId", "likesCount", "commentsCount")
          VALUES (
              new."id", 0, 0
          );
          UPDATE "post" SET "postReactionId" = (SELECT "post_reaction"."id" FROM "post_reaction" WHERE "post_reaction"."postId" = new.id) WHERE post.id = new.id;
          RETURN NULL;
        END;
        $$  LANGUAGE plpgsql
    `);
    await queryRunner.query(
      'CREATE TRIGGER create_post_reaction_trigger AFTER INSERT ON "post" FOR EACH ROW EXECUTE PROCEDURE create_post_reaction_func()',
    );

    await queryRunner.dropColumn('post', 'likesCount');
    await queryRunner.dropColumn('post', 'commentsCount');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
