import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class VideoViews1643322253706 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const postReaction = await queryRunner.getTable('post_reaction');
    if (postReaction) {
      const foreignKey = postReaction.foreignKeys.find((f) =>
        f.columnNames.includes('postId'),
      );
      if (foreignKey)
        await queryRunner.dropForeignKey(postReaction, foreignKey);
    }

    await queryRunner.createForeignKey(
      'post_reaction',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'post_reaction',
      new TableColumn({
        name: 'viewsCount',
        type: 'int',
        default: 0,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'post_view',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'startedFrom',
            type: 'int',
          },
          {
            name: 'endedAt',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`
        CREATE FUNCTION update_post_view_func()
        RETURNS TRIGGER
        AS $$
        BEGIN
            UPDATE "post_reaction" 
                SET "viewsCount" = (SELECT COUNT(DISTINCT "post_view"."userId") FROM post_view WHERE "post_view"."postId" = "new"."postId")
            WHERE 
                "post_reaction"."postId" = "new"."postId";
            RETURN NULL;
        END;
        $$  LANGUAGE plpgsql
    `);

    await queryRunner.query(
      'CREATE TRIGGER post_update_views_trigger AFTER INSERT ON "post_view" FOR EACH ROW EXECUTE PROCEDURE update_post_view_func()',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
