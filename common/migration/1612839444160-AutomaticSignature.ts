import {MigrationInterface, QueryRunner} from "typeorm";

export class AutomaticSignature1612839444160 implements MigrationInterface {
    name = 'AutomaticSignature1612839444160';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation_certificate" ADD "state" character varying NOT NULL DEFAULT 'manual'`);
        await queryRunner.query(`ALTER TABLE "participation_certificate" ADD "signaturePupil" bytea`);
        await queryRunner.query(`ALTER TABLE "participation_certificate" ADD "signatureParent" bytea`);
        await queryRunner.query(`ALTER TABLE "participation_certificate" ADD "signatureLocation" character varying`);
        await queryRunner.query(`ALTER TABLE "participation_certificate" ADD "signatureDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation_certificate" DROP COLUMN "signatureDate"`);
        await queryRunner.query(`ALTER TABLE "participation_certificate" DROP COLUMN "signatureLocation"`);
        await queryRunner.query(`ALTER TABLE "participation_certificate" DROP COLUMN "signatureParent"`);
        await queryRunner.query(`ALTER TABLE "participation_certificate" DROP COLUMN "signaturePupil"`);
        await queryRunner.query(`ALTER TABLE "participation_certificate" DROP COLUMN "state"`);
    }

}
