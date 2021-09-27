import { baseMeetingConfig } from 'entities/data/base-meeting-config';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class MeetingSchemaChanges1632558361217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE meeting ALTER COLUMN config DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE meeting ALTER COLUMN "config" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE meeting ALTER COLUMN "createdById" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE meeting ALTER COLUMN "startDate" DROP NOT NULL',
    );

    await queryRunner.renameTable('meeting', 'post');

    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'type',
        type: 'character varying',
        default: "'meeting'",
      }),
    );

    await queryRunner.dropTable('video_post');

    await queryRunner.createTable(
      new Table({
        name: 'post_tag',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'value',
            type: 'character varying',
          },
          {
            name: 'postId',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'post_tag',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
