import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserDropFacebookId1676925481085 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'facebookId');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
