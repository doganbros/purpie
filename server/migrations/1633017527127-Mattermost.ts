import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class Mattermost1633017527127 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'mattermostId',
        type: 'character varying',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
