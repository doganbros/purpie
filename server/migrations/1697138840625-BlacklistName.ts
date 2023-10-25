import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { recordEntityColumns } from './data/record-entity';
import { defaultBlacklist } from './data/default-blacklist';

export class BlacklistName1697138840625 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'blacklist_name',
        columns: [
          ...recordEntityColumns,
          {
            name: 'text',
            type: 'character varying',
          },
          {
            name: 'type',
            type: 'character varying',
          },
        ],
      }),
      true,
    );

    for (const blacklist of defaultBlacklist) {
      await queryRunner.query(
        'INSERT INTO blacklist_name ("text", "type") values ($1 ,$2)',
        [blacklist.text, blacklist.type],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
