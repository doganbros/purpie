import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserRefreshToken1627981886253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'refreshAccessToken',
        type: 'character varying',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'refreshAccessToken');
  }
}
