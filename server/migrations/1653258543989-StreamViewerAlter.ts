import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class StreamViewerAlter1653258543989 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE current_stream_viewer CASCADE;');

    await queryRunner.addColumn(
      'post_reaction',
      new TableColumn({
        name: 'liveStreamViewersCount',
        type: 'int',
        default: 0,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'current_stream_viewer',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
        ],
        uniques: [
          {
            name: 'current_stream_viewer_unique_cols',
            columnNames: ['userId', 'postId'],
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'current_stream_viewer',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'current_stream_viewer',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_post_live_stream_viewers_count_func()
    RETURNS TRIGGER
    AS $$
    BEGIN
        UPDATE "post_reaction" 
            SET "liveStreamViewersCount" = (SELECT COUNT(id) FROM current_stream_viewer WHERE "current_stream_viewer"."postId" = "new"."postId" or "current_stream_viewer"."postId" = "old"."postId")
        WHERE 
            "post_reaction"."postId" = "new"."postId" or "post_reaction"."postId" = "old"."postId";
        RETURN NULL;
    END;
    $$  LANGUAGE plpgsql
`);

    await queryRunner.query(
      'DROP TRIGGER IF EXISTS post_update_views_trigger ON "current_stream_viewer"',
    );

    await queryRunner.query(
      'CREATE TRIGGER post_update_views_trigger AFTER INSERT OR DELETE ON "current_stream_viewer" FOR EACH ROW EXECUTE PROCEDURE update_post_live_stream_viewers_count_func()',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
