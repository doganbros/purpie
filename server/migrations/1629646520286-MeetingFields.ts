import { UserRole } from 'entities/UserRole.entity';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MeetingFields1629646520286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_role',
      new TableColumn({
        name: 'canSetRole',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.manager.update(
      UserRole,
      { roleCode: 'SUPER_ADMIN' },
      { canSetRole: true },
    );

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'timeZone',
        type: 'character varying',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'conferenceStartDate',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({
        name: 'conferenceEndDate',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('meeting', 'timeZone');
    await queryRunner.dropColumn('meeting', 'conferenceStartDate');
    await queryRunner.dropColumn('meeting', 'conferenceEndDate');
  }
}
