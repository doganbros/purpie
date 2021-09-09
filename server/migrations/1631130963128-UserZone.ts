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
        type: 'int',
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

    const userChannels = await queryRunner.manager.find(UserChannel, {
      relations: ['channel'],
    });

    for (const userChannel of userChannels) {
      const userZone = await queryRunner.manager.findOne(UserZone, {
        where: { userId: userChannel.userId, zoneId: userChannel.channel.id },
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