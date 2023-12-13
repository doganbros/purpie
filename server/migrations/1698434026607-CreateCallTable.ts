import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { recordEntityColumns } from "./data/record-entity";

export class CreateCallTable1698434026607 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
              name: 'call',
              columns: [
                  ...recordEntityColumns,
                  {
                      name: 'callee',
                      type: 'character varying',
                  },
                  {
                      name: 'roomName',
                      type: 'character varying',
                  },
                  {
                      name: 'isLive',
                      type: 'boolean',
                      default: true,
                  },
                  {
                      name: 'createdById',
                      type: 'uuid',
                  },
              ],
          }),
          true,
        );

        await queryRunner.createForeignKey(
          'call',
          new TableForeignKey({
              columnNames: ['createdById'],
              referencedColumnNames: ['id'],
              referencedTableName: 'user',
              onDelete: 'CASCADE',
          }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
