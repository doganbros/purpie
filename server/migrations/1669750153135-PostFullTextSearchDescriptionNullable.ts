import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostFullTextSearchDescriptionNullable1669750153135
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE OR REPLACE FUNCTION post_search_doc_func()
          RETURNS TRIGGER
          AS $$
          BEGIN
              new.search_document := setweight(to_tsvector('simple', "new"."title"), 'A') || setweight(to_tsvector('english',  coalesce("new"."description", '')), 'B');
              return new;
          END;
          $$  LANGUAGE plpgsql
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
