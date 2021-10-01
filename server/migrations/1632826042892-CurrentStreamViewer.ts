import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CurrentStreamViewer1632826042892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            name: 'slug',
            type: 'character varying',
          },
        ],
        uniques: [
          {
            name: 'current_stream_viewer_unique_cols',
            columnNames: ['userId', 'slug'],
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
