import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UserZone1631130963128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_channel',
      new TableColumn({
        name: 'userZoneId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'user_channel',
      new TableForeignKey({
        columnNames: ['userZoneId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_zone',
        onDelete: 'CASCADE',
      }),
    );

    const userChannels = await queryRunner.manager
      .createQueryBuilder(UserChannel, 'user_channel')
      .select([
        'user_channel.id',
        'user_channel.userId',
        'channel.id',
        'channel.zoneId',
      ])
      .innerJoin('user_channel.channel', 'channel')
      .addGroupBy('channel.id')
      .addGroupBy('user_channel.id')
      .getMany();

    for (const userChannel of userChannels) {
      const userZone = await queryRunner.manager.findOne(UserZone, {
        where: {
          userId: userChannel.userId,
          zoneId: userChannel.channel.zoneId,
        },
        select: ['id'],
      });

      if (userZone)
        await queryRunner.manager.update(
          UserChannel,
          { id: userChannel.id },
          { userZoneId: userZone.id },
        );
      else
        await queryRunner.manager.delete(UserChannel, { id: userChannel.id });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
