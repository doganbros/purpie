import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

const recordEntityColumns = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
  },
  {
    name: 'createdOn',
    type: 'timestamp',
    default: 'now()',
  },
  {
    name: 'updatedOn',
    type: 'timestamp',
    isNullable: true,
  },
];

export class UserContact1627250340924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contact',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'contactUserId',
            type: 'int',
          },
        ],
        // uniques: ['userId', 'contactUserId'],
        uniques: [
          {
            name: 'contact_uid_cuid_unique_cols',
            columnNames: ['userId', 'contactUserId'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'contact',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'contact',
      new TableForeignKey({
        columnNames: ['contactUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE contact CASCADE;`);
  }
}