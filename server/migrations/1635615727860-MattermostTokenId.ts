import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MattermostTokenId1635615727860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_refresh_token',
      new TableColumn({
        name: 'mattermostTokenId',
        type: 'character varying',
        isNullable: true,
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
