import { MigrationInterface, QueryRunner } from 'typeorm';
import { ChannelRoleCode, ZoneRoleCode } from '../types/RoleCodes';
import { UserChannel } from '../entities/UserChannel.entity';
import { UserZone } from '../entities/UserZone.entity';

export class UserChannelAndZoneRoleCodeFix1681761857599
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userChannels = await queryRunner.manager.find(UserChannel);

    for (const userChannel of userChannels) {
      let channelRoleCode;
      if (userChannel.channelRoleCode.toString() === 'SUPER_ADMIN')
        channelRoleCode = ChannelRoleCode.OWNER;
      else if (userChannel.channelRoleCode.toString() === 'ADMIN')
        channelRoleCode = ChannelRoleCode.MODERATOR;
      else channelRoleCode = ChannelRoleCode.USER;

      await queryRunner.manager.update(
        UserChannel,
        { id: userChannel.id },
        { channelRoleCode },
      );
    }

    const userZones = await queryRunner.manager.find(UserZone);

    for (const userZone of userZones) {
      let zoneRoleCode;
      if (userZone.zoneRoleCode.toString() === 'SUPER_ADMIN')
        zoneRoleCode = ZoneRoleCode.OWNER;
      else if (userZone.zoneRoleCode.toString() === 'ADMIN')
        zoneRoleCode = ZoneRoleCode.MODERATOR;
      else zoneRoleCode = ZoneRoleCode.USER;

      await queryRunner.manager.update(
        UserZone,
        { id: userZone.id },
        { zoneRoleCode },
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
