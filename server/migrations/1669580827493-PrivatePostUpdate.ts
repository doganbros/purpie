import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrivatePostUpdate1669580827493 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('post', 'private');
    await queryRunner.dropColumn('post', 'userContactExclusive');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
