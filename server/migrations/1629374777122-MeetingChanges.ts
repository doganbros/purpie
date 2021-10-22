import { Channel } from 'entities/Channel.entity';
import { baseMeetingConfig } from 'entities/data/base-meeting-config';
import { User } from 'entities/User.entity';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class MeetingChanges1629374777122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const meeting = await queryRunner.getTable('meeting');

    await queryRunner.addColumn(
      'meeting',
      new TableColumn({ name: 'liveStream', type: 'boolean', default: false }),
    );
    await queryRunner.addColumn(
      'meeting',
      new TableColumn({ name: 'record', type: 'boolean', default: false }),
    );

    if (meeting) {
      const foreignKey = meeting.foreignKeys.find((f) =>
        f.columnNames.includes('zoneId'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(meeting, foreignKey);

      await queryRunner.dropColumn(meeting, 'zoneId');
    }

    await queryRunner.dropColumn('zone', 'zoneMeetingConfig');

    await queryRunner.manager.update(
      User,
      {},
      {
        userMeetingConfig: {
          jitsiConfig: baseMeetingConfig,
          privacyConfig: {
            liveStream: false,
            record: false,
            public: true,
            userContactExclusive: false,
          },
        },
      },
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'meeting',
      new TableColumn({ name: 'zoneId', type: 'int', isNullable: true }),
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

    await queryRunner.dropColumn('meeting', 'liveStream');
    await queryRunner.dropColumn('meeting', 'record');
  }
}
