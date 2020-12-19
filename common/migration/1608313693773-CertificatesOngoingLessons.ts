import {MigrationInterface, QueryRunner} from "typeorm";

export class CertificatesOngoingLessons1608313693773 implements MigrationInterface {
    name = 'CertificatesOngoingLessons1608313693773';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation_certificate" ADD "ongoingLessons" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation_certificate" DROP COLUMN "ongoingLessons"`, undefined);
    }

}
