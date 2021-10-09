import { Post } from 'entities/Post.entity';
import { User } from 'entities/User.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { MeetingConfig } from 'types/Meeting';

export class AuthChanges1633783711421 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_refresh_token',
        columns: [
          {
            name: 'id',
            type: 'character varying',
            isPrimary: true,
            isGenerated: false,
          },
          {
            name: 'token',
            type: 'character varying',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'createdOn',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user_refresh_token',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.dropColumn('user', 'refreshAccessToken');
    await queryRunner.dropColumn('channel', 'channelMeetingConfig');

    const users = await queryRunner.manager.find(User);

    for (const user of users) {
      const oldConfig = user.userMeetingConfig as Record<string, any>;
      const newConfig: MeetingConfig = {
        jitsiConfig: oldConfig,
        privacyConfig: {
          public: true,
          userContactExclusive: false,
          liveStream: false,
          record: false,
        },
      };
      await queryRunner.manager.update(
        User,
        { id: user.id },
        { userMeetingConfig: newConfig },
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
