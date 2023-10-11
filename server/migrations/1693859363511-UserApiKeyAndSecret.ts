import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserApiKeyAndSecret1693859363511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'apiKey',
        type: 'character varying',
        isNullable: true,
        isUnique: true,
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'apiSecret',
        type: 'character varying',
        isNullable: true,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
