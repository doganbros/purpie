import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChatAttachmentName1655839700321 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'chat_message_attachment',
      new TableColumn({
        name: 'originalFileName',
        type: 'character varying',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
