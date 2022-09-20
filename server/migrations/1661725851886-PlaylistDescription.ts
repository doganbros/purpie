import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PlaylistDescription1661725851886 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.addColumn(
      'playlist',
      new TableColumn({
        type: 'character varying',
        name: 'description',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
