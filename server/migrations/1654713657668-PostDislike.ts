import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PostDislike1654713657668 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'notification',
      new TableColumn({
        name: 'counter',
        type: 'int',
        default: 1,
      }),
    );
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'allowDislike',
        type: 'boolean',
        default: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
