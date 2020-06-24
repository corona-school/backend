import {MigrationInterface, QueryRunner} from "typeorm";

export class CleanupMails1592927037226 implements MigrationInterface {
    name = 'CleanupMails1592927037226';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_fef5c21e7977af1f5fdf2153e0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_a547b949511093852667f04b6e5"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_7e8326dd14aab100e88912c9d2b"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_72eb9ce4ff7e5e1a2d668bb2671"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_3d73a8a5c5e8a120b63df389b64"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_24e84ce75ede0251f5c4f30e737"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "automaticMailsForConfirmationDisabled"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "automaticMailsForDissolutionDisabled"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "automaticMailsForFeedbackDisabled"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "UQ_3d73a8a5c5e8a120b63df389b64"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "confirmationToStudentMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "UQ_fef5c21e7977af1f5fdf2153e0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "confirmationToPupilMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "UQ_72eb9ce4ff7e5e1a2d668bb2671"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "dissolutionToStudentMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "UQ_24e84ce75ede0251f5c4f30e737"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "dissolutionToPupilMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "UQ_7e8326dd14aab100e88912c9d2b"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "feedbackToPupilMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "UQ_a547b949511093852667f04b6e5"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "feedbackToStudentMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "feedbackToPupilMail" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "feedbackToStudentMail" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "feedbackToStudentMail"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "feedbackToPupilMail"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "feedbackToStudentMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "UQ_a547b949511093852667f04b6e5" UNIQUE ("feedbackToStudentMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "feedbackToPupilMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "UQ_7e8326dd14aab100e88912c9d2b" UNIQUE ("feedbackToPupilMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "dissolutionToPupilMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "UQ_24e84ce75ede0251f5c4f30e737" UNIQUE ("dissolutionToPupilMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "dissolutionToStudentMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "UQ_72eb9ce4ff7e5e1a2d668bb2671" UNIQUE ("dissolutionToStudentMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "confirmationToPupilMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "UQ_fef5c21e7977af1f5fdf2153e0f" UNIQUE ("confirmationToPupilMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "confirmationToStudentMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "UQ_3d73a8a5c5e8a120b63df389b64" UNIQUE ("confirmationToStudentMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "automaticMailsForFeedbackDisabled" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "automaticMailsForDissolutionDisabled" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "automaticMailsForConfirmationDisabled" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_24e84ce75ede0251f5c4f30e737" FOREIGN KEY ("dissolutionToPupilMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_3d73a8a5c5e8a120b63df389b64" FOREIGN KEY ("confirmationToStudentMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_72eb9ce4ff7e5e1a2d668bb2671" FOREIGN KEY ("dissolutionToStudentMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_7e8326dd14aab100e88912c9d2b" FOREIGN KEY ("feedbackToPupilMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_a547b949511093852667f04b6e5" FOREIGN KEY ("feedbackToStudentMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_fef5c21e7977af1f5fdf2153e0f" FOREIGN KEY ("confirmationToPupilMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
