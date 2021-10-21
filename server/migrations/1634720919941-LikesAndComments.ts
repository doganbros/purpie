import { baseMeetingConfig } from 'entities/data/base-meeting-config';
import { User } from 'entities/User.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { MeetingConfig } from 'types/Meeting';
import { recordEntityColumns } from './data/record-entity';

export class LikesAndComments1634720919941 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_like',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
        ],
        uniques: [
          {
            name: 'post_like_userId_postId_uniq',
            columnNames: ['userId', 'postId'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'post_like',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'post_like',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'saved_post',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
        ],
        uniques: [
          {
            name: 'saved_post_like_userId_postId_uniq',
            columnNames: ['userId', 'postId'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'saved_post',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'saved_post',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'post_comment',
        columns: [
          ...recordEntityColumns,
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
          {
            name: 'comment',
            type: 'character varying',
          },
          {
            name: 'parentId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'edited',
            type: 'boolean',
            default: false,
          },
          {
            name: 'publishedInLiveStream',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'post_comment',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'post_comment',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "userMeetingConfig" DROP DEFAULT',
    );

    await queryRunner.changeColumn(
      'user',
      'userMeetingConfig',
      new TableColumn({
        name: 'userMeetingConfig',
        type: 'text',
        default: `'${JSON.stringify({
          jitsiConfig: baseMeetingConfig,
          privacyConfig: {
            public: true,
            userContactExclusive: false,
            record: false,
            liveStream: false,
          },
        } as MeetingConfig)}'`,
      }),
    );

    const users = await queryRunner.manager.find(User, {
      select: ['userMeetingConfig', 'id'],
    });

    for (const user of users) {
      const oldConfig = user.userMeetingConfig as Record<string, any>;

      if (oldConfig && !oldConfig.privacyConfig) {
        await queryRunner.manager.update(
          User,
          { id: user.id },
          {
            userMeetingConfig: {
              jitsiConfig: oldConfig,
              privacyConfig: {
                public: true,
                userContactExclusive: false,
                record: false,
                liveStream: false,
              },
            },
          },
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
