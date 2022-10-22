import {MigrationInterface, QueryRunner, TableUnique} from 'typeorm';

export class UserChannelUniqueConstraint1663092054559 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remove duplicated rows
        await queryRunner.query(`
            DELETE
                FROM user_channel
                WHERE ID NOT IN
                      (SELECT MAX(ID) AS MaxRecordID
                       FROM user_channel
                       GROUP BY "userId", "channelId", "channelRoleCode");
        `);


        const constraint = new TableUnique({
            name: 'user_channel_unique_index',
            columnNames: ['userId', 'channelId', 'channelRoleCode']
        });

        await queryRunner.createUniqueConstraint(
            'user_channel',
            constraint
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
