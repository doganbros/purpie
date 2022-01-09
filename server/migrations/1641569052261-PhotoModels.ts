import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PhotoModels1641569052261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'displayPhoto',
        type: 'character varying',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'channel',
      new TableColumn({
        name: 'displayPhoto',
        type: 'character varying',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'zone',
      new TableColumn({
        name: 'displayPhoto',
        type: 'character varying',
        isNullable: true,
      }),
    );

    await queryRunner.query(
      'ALTER TABLE user_role RENAME COLUMN "canSetRole" TO "canManageRole"',
    );
    await queryRunner.query(
      'ALTER TABLE zone_role RENAME COLUMN "canSetRole" TO "canManageRole"',
    );
    await queryRunner.query(
      'ALTER TABLE channel_role RENAME COLUMN "canSetRole" TO "canManageRole"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
