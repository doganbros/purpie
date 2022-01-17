import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RoleManagement1642240844928 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_role',
      new TableColumn({
        name: 'isSystemRole',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'zone_role',
      new TableColumn({
        name: 'isSystemRole',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'channel_role',
      new TableColumn({
        name: 'isSystemRole',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.query(`
      UPDATE "user_role" SET "isSystemRole" = true;
      UPDATE "zone_role" SET "isSystemRole" = true;
      UPDATE "channel_role" SET "isSystemRole" = true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
