import {MigrationInterface, QueryRunner} from "typeorm";

export class CleanupMails1592927037226 implements MigrationInterface {
    name = 'CleanupMails1592927037226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_fef5c21e7977af1f5fdf2153e0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_72eb9ce4ff7e5e1a2d668bb2671"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_3d73a8a5c5e8a120b63df389b64"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_24e84ce75ede0251f5c4f30e737"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "automaticMailsForConfirmationDisabled"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "automaticMailsForDissolutionDisabled"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "automaticMailsForFeedbackDisabled"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "REL_3d73a8a5c5e8a120b63df389b6"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "confirmationToStudentMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "REL_fef5c21e7977af1f5fdf2153e0"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "confirmationToPupilMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "REL_72eb9ce4ff7e5e1a2d668bb267"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "dissolutionToStudentMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "REL_24e84ce75ede0251f5c4f30e73"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "dissolutionToPupilMailId"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "verification" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "verifiedAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "authToken" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "authTokenSent" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "dissolveReason" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "verification" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "verifiedAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "authToken" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "authTokenSent" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "verification" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "verifiedAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "authToken" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "authTokenSent" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastSentScreeningInvitationDate" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastSentInstructorScreeningInvitationDate" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastSentInstructorScreeningInvitationDate" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastSentScreeningInvitationDate" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "authTokenSent" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "authToken" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "verifiedAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "verification" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "authTokenSent" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "authToken" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "verifiedAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "verification" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "dissolveReason" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "authTokenSent" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "authToken" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "verifiedAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "verification" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "dissolutionToPupilMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "REL_24e84ce75ede0251f5c4f30e73" UNIQUE ("dissolutionToPupilMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "dissolutionToStudentMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "REL_72eb9ce4ff7e5e1a2d668bb267" UNIQUE ("dissolutionToStudentMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "confirmationToPupilMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "REL_fef5c21e7977af1f5fdf2153e0" UNIQUE ("confirmationToPupilMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "confirmationToStudentMailId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "REL_3d73a8a5c5e8a120b63df389b6" UNIQUE ("confirmationToStudentMailId")`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "automaticMailsForFeedbackDisabled" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "automaticMailsForDissolutionDisabled" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD "automaticMailsForConfirmationDisabled" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_24e84ce75ede0251f5c4f30e737" FOREIGN KEY ("dissolutionToPupilMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_3d73a8a5c5e8a120b63df389b64" FOREIGN KEY ("confirmationToStudentMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_72eb9ce4ff7e5e1a2d668bb2671" FOREIGN KEY ("dissolutionToStudentMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_fef5c21e7977af1f5fdf2153e0f" FOREIGN KEY ("confirmationToPupilMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
