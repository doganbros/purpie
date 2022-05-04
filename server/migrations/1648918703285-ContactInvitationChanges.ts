import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContactInvitationChanges1648918703285
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const contactInvitations = await queryRunner.query(
      'SELECT "contact_invitation".id, "contact_invitation"."inviterId", "contact_invitation"."inviteeId", "user"."email" FROM "contact_invitation" INNER JOIN "user" ON "user"."id" = "contact_invitation"."inviteeId"',
    );

    for (const invitation of contactInvitations) {
      await queryRunner.query(
        'INSERT INTO invitation ("email", "createdById") values ($1 ,$2)',
        [invitation.email, invitation.email],
      );
    }
    await queryRunner.query(`DROP TABLE "contact_invitation" CASCADE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
