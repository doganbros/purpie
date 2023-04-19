import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChannelBackgroundPhotoColumn1681851886789
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'channel',
      new TableColumn({
        name: 'backgroundPhoto',
        type: 'character varying',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
