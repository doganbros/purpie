import { UserRole } from 'entities/UserRole.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class Client1629235524265 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('zone', 'apiKey');
    await queryRunner.dropColumn('zone', 'apiSecret');

    await queryRunner.addColumn(
      'user_role',
      new TableColumn({
        name: 'canCreateClient',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.manager.update(
      UserRole,
      { roleCode: 'SUPER_ADMIN' },
      { canCreateClient: true },
    );

    await queryRunner.createTable(
      new Table({
        name: 'client_role',
        columns: [
          {
            name: 'roleCode',
            type: 'character varying',
            isPrimary: true,
          },
          {
            name: 'roleName',
            type: 'character varying',
          },
          {
            name: 'manageMeeting',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'client',
        columns: [
          ...recordEntityColumns,
          {
            name: 'name',
            type: 'character varying',
          },
          {
            name: 'apiKey',
            isUnique: true,
            type: 'character varying',
          },
          {
            name: 'apiSecret',
            type: 'character varying',
          },
          {
            name: 'clientRoleCode',
            type: 'character varying',
          },
          {
            name: 'refreshToken',
            isNullable: true,
            type: 'character varying',
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
      'client',
      new TableForeignKey({
        columnNames: ['clientRoleCode'],
        referencedColumnNames: ['roleCode'],
        referencedTableName: 'client_role',
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'client',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    const clientRoleSeeds = `
        INSERT INTO client_role ("roleName", "roleCode", "manageMeeting")
        values
        ('Super Admin', 'SUPER_ADMIN', true),
        ('Admin', 'ADMIN', false),
        ('Normal', 'NORMAL', false);
    `;

    await queryRunner.query(clientRoleSeeds);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE client_role CASCADE;`);
    await queryRunner.query(`DROP TABLE client CASCADE;`);

    await queryRunner.addColumn(
      'zone',
      new TableColumn({
        name: 'apiKey',
        type: 'character varying',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'zone',
      new TableColumn({
        name: 'apiSecret',
        type: 'character varying',
        isNullable: true,
      }),
    );
  }
}
