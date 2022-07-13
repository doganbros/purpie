import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class MeetingSlugKey1652890981281 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const meetingLog = await queryRunner.getTable('meeting_log');
    if (meetingLog) {
      const foreignKey = meetingLog.foreignKeys.find((f) =>
        f.columnNames.includes('meetingSlug'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(meetingLog, foreignKey);

      await queryRunner.createForeignKey(
        'meeting_log',
        new TableForeignKey({
          columnNames: ['meetingSlug'],
          referencedColumnNames: ['slug'],
          referencedTableName: 'post',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );
    }

    const postVideo = await queryRunner.getTable('post_video');
    if (postVideo) {
      const foreignKey = postVideo.foreignKeys.find((f) =>
        f.columnNames.includes('slug'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(postVideo, foreignKey);

      await queryRunner.createForeignKey(
        'post_video',
        new TableForeignKey({
          columnNames: ['slug'],
          referencedColumnNames: ['slug'],
          referencedTableName: 'post',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );
    }

    const streamLog = await queryRunner.getTable('stream_log');
    if (streamLog) {
        await queryRunner.query('DELETE FROM stream_log');
      const foreignKey = streamLog.foreignKeys.find((f) =>
        f.columnNames.includes('slug'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(streamLog, foreignKey);

      await queryRunner.createForeignKey(
        'stream_log',
        new TableForeignKey({
          columnNames: ['slug'],
          referencedColumnNames: ['slug'],
          referencedTableName: 'post',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );
    }

    const currentStreamViewer = await queryRunner.getTable(
      'current_stream_viewer',
    );
    if (currentStreamViewer) {
        await queryRunner.query('DELETE FROM current_stream_viewer');
      const foreignKey = currentStreamViewer.foreignKeys.find((f) =>
        f.columnNames.includes('slug'),
      );
      if (foreignKey)
        await queryRunner.dropForeignKey(currentStreamViewer, foreignKey);

      await queryRunner.createForeignKey(
        'current_stream_viewer',
        new TableForeignKey({
          columnNames: ['slug'],
          referencedColumnNames: ['slug'],
          referencedTableName: 'post',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
