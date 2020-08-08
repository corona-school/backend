import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateParticipationCertificate1596842496864 implements MigrationInterface {
    name = 'UpdateParticipationCertificate1596842496864';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation_certificate" ALTER COLUMN "hoursPerWeek" TYPE numeric`, undefined);
        await queryRunner.query(`ALTER TABLE "participation_certificate" ALTER COLUMN "hoursTotal" TYPE numeric`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation_certificate" ALTER COLUMN "hoursPerWeek" TYPE integer`, undefined);
        await queryRunner.query(`ALTER TABLE "participation_certificate" ALTER COLUMN "hoursTotal" TYPE integer`, undefined);
    }

}
