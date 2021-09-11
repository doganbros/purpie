import { baseMeetingConfig } from 'entities/data/base-meeting-config';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';


export class InitialMigration1625561314952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_zone_permission',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'canCreateChannel',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canAddUser',
            type: 'boolean',
            default: 'false',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_zone',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'zoneId',
            type: 'int',
          },
          {
            name: 'userZonePermissionId',
            type: 'int',
            isUnique: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'zone',
        columns: [
          ...recordEntityColumns,
          {
            name: 'name',
            type: 'character varying',
          },
          {
            name: 'subdomain',
            type: 'character varying',
            isUnique: true,
          },
          {
            name: 'active',
            type: 'boolean',
            default: 'true',
          },
          {
            name: 'public',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'description',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'apiKey',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'apiSecret',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'zoneMeetingConfig',
            type: 'text',
            default: `'${JSON.stringify(baseMeetingConfig)}'`,
          },
          {
            name: 'createdById',
            type: 'int',
          },
          {
            name: 'adminId',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          ...recordEntityColumns,
          {
            name: 'firstName',
            type: 'character varying',
          },
          {
            name: 'lastName',
            type: 'character varying',
          },
          {
            name: 'email',
            type: 'character varying',
            isUnique: true,
          },
          {
            name: 'emailConfirmed',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'password',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'googleId',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'facebookId',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'forgotPasswordToken',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'mailVerificationToken',
            type: 'character varying',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_channel_permission',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'canAddUser',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'canContribute',
            type: 'boolean',
            default: 'false',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_channel',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'channelId',
            type: 'int',
          },
          {
            name: 'userChannelPermissionId',
            isUnique: true,
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'channel',
        columns: [
          ...recordEntityColumns,
          {
            name: 'name',
            type: 'character varying',
          },
          {
            name: 'topic',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            default: 'true',
          },
          {
            name: 'public',
            type: 'boolean',
            default: 'false',
          },
          {
            name: 'zoneId',
            type: 'int',
          },
          {
            name: 'createdById',
            type: 'int',
          },
          {
            name: 'adminId',
            type: 'int',
          },
          {
            name: 'channelMeetingConfig',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'meeting',
        columns: [
          ...recordEntityColumns,
          {
            name: 'title',
            type: 'character varying',
          },
          {
            name: 'description',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'slug',
            type: 'character varying',
            isUnique: true,
          },
          {
            name: 'startDate',
            type: 'timestamp',
          },
          {
            name: 'endDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdById',
            type: 'int',
          },
          {
            name: 'adminId',
            type: 'int',
          },
          {
            name: 'zoneId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'channelId',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'invitation',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'channelId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'zoneId',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_zone',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_zone',
      new TableForeignKey({
        columnNames: ['zoneId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'zone',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_zone',
      new TableForeignKey({
        columnNames: ['userZonePermissionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_zone_permission',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'zone',
      new TableForeignKey({
        columnNames: ['adminId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'zone',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'user_channel',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'user_channel',
      new TableForeignKey({
        columnNames: ['channelId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'channel',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'user_channel',
      new TableForeignKey({
        columnNames: ['userChannelPermissionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_channel_permission',
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'channel',
      new TableForeignKey({
        columnNames: ['zoneId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'zone',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'channel',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'channel',
      new TableForeignKey({
        columnNames: ['adminId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'meeting',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'meeting',
      new TableForeignKey({
        columnNames: ['adminId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'meeting',
      new TableForeignKey({
        columnNames: ['zoneId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'zone',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'meeting',
      new TableForeignKey({
        columnNames: ['channelId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'channel',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'invitation',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'invitation',
      new TableForeignKey({
        columnNames: ['channelId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'channel',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'invitation',
      new TableForeignKey({
        columnNames: ['zoneId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'zone',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'user',
      'zone',
      'channel',
      'meeting',
      'invitation',
      'user_zone',
      'user_zone_permission',
      'user_channel',
      'user_channel_permission',
    ];
    for (const table of tables) {
      await queryRunner.query(`DROP TABLE "${table}" CASCADE;`);
    }
  }
}
