import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ViewsExtraFeatures1643779532708 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'post_view',
      new TableColumn({
        name: 'shouldCount',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION update_post_view_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            UPDATE "post_reaction" 
                SET "viewsCount" = (SELECT COUNT(id) FROM post_view WHERE "post_view"."postId" = "new"."postId" and "post_view"."shouldCount" = true)
            WHERE 
                "post_reaction"."postId" = "new"."postId";
            RETURN NULL;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.query('DROP TRIGGER IF EXISTS post_update_views_trigger ON "post_view"');

    await queryRunner.query(
      'CREATE TRIGGER post_update_views_trigger AFTER INSERT OR DELETE ON "post_view" FOR EACH ROW EXECUTE PROCEDURE update_post_view_func()',
    );

    await queryRunner.query('TRUNCATE post_view');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
