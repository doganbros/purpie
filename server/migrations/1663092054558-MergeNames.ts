import { User } from 'entities/User.entity';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MergeNames1663092054558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'fullName',
        type: 'character varying',
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `UPDATE "user" SET "fullName" = CONCAT("firstName", ' ', "lastName")`,
    );

    await queryRunner.changeColumn(
      'user',
      'fullName',
      new TableColumn({
        name: 'fullName',
        type: 'character varying',
        isNullable: false,
      }),
    );

    await queryRunner.query(
      `UPDATE "user" SET search_document = setweight(to_tsvector('simple', "fullName"), 'A') || setweight(to_tsvector('simple', coalesce("userName", '')), 'A') || setweight(to_tsvector('simple', "email"), 'B')`,
    );

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION user_search_doc_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
          new.search_document := setweight(to_tsvector('simple', new."fullName"), 'A') || setweight(to_tsvector('simple', coalesce(new."userName", '')), 'A') || setweight(to_tsvector('simple', new."email"), 'B');
            return new;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.dropColumn('user', 'firstName');
    await queryRunner.dropColumn('user', 'lastName');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
