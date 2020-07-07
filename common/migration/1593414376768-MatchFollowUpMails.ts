import {MigrationInterface, QueryRunner} from "typeorm";

export class MatchFollowUpMails1593414376768 implements MigrationInterface {
    name = 'MatchFollowUpMails1593414376768';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" ADD "followUpToPupilMail" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "followUpToStudentMail" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "followUpToStudentMail"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "followUpToPupilMail"`, undefined);
    }

}
