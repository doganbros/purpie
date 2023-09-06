import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSavedPostTable1694031641843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE saved_post CASCADE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
