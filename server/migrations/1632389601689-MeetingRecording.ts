import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { recordEntityColumns } from './data/record-entity';

export class MeetingRecording1632389601689 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'meeting_recording',
        columns: [
          ...recordEntityColumns,
          {
            name: 'meetingSlug',
            type: 'character varying',
          },
          {
            name: 'fileName',
            type: 'character varying',
          },
        ],
        uniques: [
          {
            name: 'meeting_recording_slug_fileName_uniq',
            columnNames: ['meetingSlug', 'fileName'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'meeting_recording',
      new TableForeignKey({
        columnNames: ['meetingSlug'],
        referencedColumnNames: ['slug'],
        referencedTableName: 'meeting',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
