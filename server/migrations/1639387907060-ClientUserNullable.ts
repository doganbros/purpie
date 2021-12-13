import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ClientUserNullable1639387907060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE client ALTER COLUMN "createdById" DROP NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
