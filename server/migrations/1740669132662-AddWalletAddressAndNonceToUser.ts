import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWalletAddressAndNonceToUser1740669132662 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ADD "walletAddress" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD "nonce" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_walletAddress" UNIQUE ("walletAddress")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "UQ_user_walletAddress"`,
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nonce"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "walletAddress"`);
    }

}
