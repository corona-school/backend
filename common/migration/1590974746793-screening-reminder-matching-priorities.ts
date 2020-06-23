import {MigrationInterface, QueryRunner} from "typeorm";

export class screeningReminderMatchingPriorities1590974746793 implements MigrationInterface {
    name = 'screeningReminderMatchingPriorities1590974746793';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "sentScreeningReminderCount" integer NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "lastSentScreeningInvitationDate" TIMESTAMP DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "matchingPriority" integer NOT NULL DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "matchingPriority"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "lastSentScreeningInvitationDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "sentScreeningReminderCount"`, undefined);
    }

}
