import { defaultPostSettings } from 'entities/data/default-post-settings';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PostSettings1654886513030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        type: 'text',
        name: 'postSettings',
        default: `'${JSON.stringify(defaultPostSettings)}'`,
      }),
    );
    await queryRunner.addColumn(
      'channel',
      new TableColumn({
        type: 'text',
        name: 'postSettings',
        default: `'${JSON.stringify(defaultPostSettings)}'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
