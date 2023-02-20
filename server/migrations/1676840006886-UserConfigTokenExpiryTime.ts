import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/User.entity';
import { MeetingConfig } from '../types/Meeting';

export class UserConfigTokenExpiryTime1676840006886
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.manager.find(User, {
      select: ['userMeetingConfig', 'id'],
    });

    for (const user of users) {
      const oldConfig = user.userMeetingConfig;
      const newConfig: MeetingConfig = {
        jitsiConfig: oldConfig.jitsiConfig,
        privacyConfig: {
          ...oldConfig.privacyConfig,
          joinLinkExpiryAsHours: 24,
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
