import { ChannelRole } from 'entities/ChannelRole.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FullTextSearch1640772409145 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'channel_role',
      new TableColumn({
        name: 'canSetRole',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'zone_role',
      new TableColumn({
        name: 'canSetRole',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.query(
      `UPDATE channel_role SET "canSetRole" = true WHERE roleCode = 'SUPER_ADMIN'`,
    );
    await queryRunner.query(
      `UPDATE zone_role SET "canSetRole" = true WHERE roleCode = 'SUPER_ADMIN'`,
    );

    await queryRunner.query('CREATE extension if not EXISTS pg_trgm;');
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'search_document',
        type: 'tsvector',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'channel',
      new TableColumn({
        name: 'search_document',
        type: 'tsvector',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'zone',
      new TableColumn({
        name: 'search_document',
        type: 'tsvector',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'search_document',
        type: 'tsvector',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'likesCount',
        type: 'int',
        default: 0,
      }),
    );
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'commentsCount',
        type: 'int',
        default: 0,
      }),
    );

    // post likes and post comments

    await queryRunner.query(
      `UPDATE "post" SET "likesCount" = (SELECT COUNT(*) FROM post_like WHERE "post_like"."postId" = "post"."id"), "commentsCount" = (SELECT COUNT(*) FROM post_comment WHERE "post_comment"."postId" = "post"."id")`,
    );

    await queryRunner.query(`
        CREATE FUNCTION update_post_likes_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            UPDATE "post" SET "likesCount" = (SELECT COUNT(*) FROM post_like WHERE "post_like"."postId" = "new"."postId" or "post_like"."postId" = "old"."postId") WHERE "post"."id" = "old"."postId" or "post".id = "new"."postId";
            RETURN NULL;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.query(
      'CREATE TRIGGER post_update_likes_trigger AFTER INSERT OR UPDATE OR DELETE ON "post_like" FOR EACH ROW EXECUTE PROCEDURE update_post_likes_func()',
    );

    await queryRunner.query(`
        CREATE FUNCTION update_post_comments_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            UPDATE "post" SET "commentsCount" = (SELECT COUNT(*) FROM post_comment WHERE "post_comment"."postId" = "new"."postId" or "post_comment"."postId" = "old"."postId") WHERE "post"."id" = "old"."postId" or "post".id = "new"."postId";
            RETURN NULL;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.query(
      'CREATE TRIGGER post_update_comments_trigger AFTER INSERT OR UPDATE OR DELETE ON "post_comment" FOR EACH ROW EXECUTE PROCEDURE update_post_comments_func()',
    );

    // channel search setup

    await queryRunner.query(
      `UPDATE channel SET search_document = setweight(to_tsvector('simple', "name"), 'A') || setweight(to_tsvector('simple', coalesce("topic", '')), 'B') || setweight(to_tsvector('english', coalesce("description", '')), 'C')`,
    );

    await queryRunner.query(
      'CREATE INDEX channel_search_document_idx ON channel USING GIN (search_document)',
    );

    await queryRunner.query(`
        CREATE FUNCTION channel_search_doc_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            new.search_document := setweight(to_tsvector('simple', "new"."name"), 'A') || setweight(to_tsvector('simple', coalesce("new"."topic", '')), 'B') || setweight(to_tsvector('english', coalesce("new"."description", '')), 'C');
            return new;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.query(
      'CREATE TRIGGER channel_search_doc_trigger BEFORE INSERT OR UPDATE ON channel FOR EACH ROW EXECUTE PROCEDURE channel_search_doc_func()',
    );

    // Zone search setup

    await queryRunner.query(
      `UPDATE zone SET search_document = setweight(to_tsvector('simple', "subdomain"), 'A') || setweight(to_tsvector('simple', "name"), 'B') || setweight(to_tsvector('english', coalesce("description", '')), 'C')`,
    );

    await queryRunner.query(
      'CREATE INDEX zone_search_document_idx ON zone USING GIN (search_document)',
    );

    await queryRunner.query(`
        CREATE FUNCTION zone_search_doc_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            new.search_document := setweight(to_tsvector('simple', "new"."subdomain"), 'A') || setweight(to_tsvector('simple', "new"."name"), 'B') || setweight(to_tsvector('english', coalesce("new"."description", '')), 'C');
            return new;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.query(
      'CREATE TRIGGER zone_search_doc_trigger BEFORE INSERT OR UPDATE ON zone FOR EACH ROW EXECUTE PROCEDURE zone_search_doc_func()',
    );

    // Profile search setup

    await queryRunner.query(
      `UPDATE "user" SET search_document = setweight(to_tsvector('simple', "firstName"), 'A') || setweight(to_tsvector('simple', "lastName"), 'A') || setweight(to_tsvector('simple', coalesce("userName", '')), 'A') || setweight(to_tsvector('simple', "email"), 'B')`,
    );

    await queryRunner.query(
      'CREATE INDEX user_search_document_idx ON "user" USING GIN (search_document)',
    );

    await queryRunner.query(`
        CREATE FUNCTION user_search_doc_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            new.search_document := setweight(to_tsvector('simple', new."firstName"), 'A') || setweight(to_tsvector('simple', new."lastName"), 'A') || setweight(to_tsvector('simple', coalesce(new."userName", '')), 'A') || setweight(to_tsvector('simple', new."email"), 'B');
            return new;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.query(
      'CREATE TRIGGER user_search_doc_trigger BEFORE INSERT OR UPDATE ON "user" FOR EACH ROW EXECUTE PROCEDURE user_search_doc_func()',
    );

    // Post search setup

    await queryRunner.query(
      `UPDATE "post" SET search_document = setweight(to_tsvector('simple', "title"), 'A') || setweight(to_tsvector('english', "description"), 'B')`,
    );

    await queryRunner.query(
      'CREATE INDEX post_search_document_idx ON post USING GIN (search_document)',
    );

    await queryRunner.query(`
          CREATE FUNCTION post_search_doc_func()
          RETURNS TRIGGER
          AS $$
          BEGIN
              new.search_document := setweight(to_tsvector('simple', "new"."title"), 'A') || setweight(to_tsvector('english',  "new"."description"), 'B');
              return new;
          END;
          $$  LANGUAGE plpgsql
      `);

    await queryRunner.query(
      'CREATE TRIGGER post_search_doc_trigger BEFORE INSERT OR UPDATE ON post FOR EACH ROW EXECUTE PROCEDURE post_search_doc_func()',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
