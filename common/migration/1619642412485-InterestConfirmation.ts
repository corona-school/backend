import {MigrationInterface, QueryRunner} from "typeorm";

export class InterestConfirmation1619642412485 implements MigrationInterface {
    name = 'InterestConfirmation1619642412485';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pupil_tutoring_interest_confirmation_request" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'pending', "token" character varying NOT NULL, "reminderSentDate" TIMESTAMP DEFAULT null, "pupilId" integer, CONSTRAINT "REL_5928ac6454eee0bfbdb8e538ef" UNIQUE ("pupilId"), CONSTRAINT "PK_5f3515ba0bd182b1cc34f06ef11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8108668f1658b14b9db299634e" ON "pupil_tutoring_interest_confirmation_request" ("token") `);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'projectMatchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'updateProjectFields', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting', 'contactExpert', 'participantJoinedCourse', 'participantLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated', 'instructorIssuedCertificate', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestStatusChange')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum" USING "logtype"::"text"::"log_logtype_enum"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" ADD CONSTRAINT "FK_5928ac6454eee0bfbdb8e538ef8" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" DROP CONSTRAINT "FK_5928ac6454eee0bfbdb8e538ef8"`);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum_old" AS ENUM('accessedByScreener', 'bbbMeeting', 'cancelledCourse', 'cancelledSubcourse', 'certificateRequest', 'contactExpert', 'contactMentor', 'createdCourse', 'createdCourseAttendanceLog', 'deActivate', 'fetchedFromWix', 'instructorIssuedCertificate', 'matchDissolve', 'misc', 'participantJoinedCourse', 'participantJoinedWaitingList', 'participantLeftCourse', 'participantLeftWaitingList', 'projectMatchDissolve', 'updatePersonal', 'updateProjectFields', 'updateStudentDescription', 'updateSubjects', 'updatedByScreener', 'userAccessedCourseWhileAuthenticated', 'verificationRequets', 'verified')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_old" USING "logtype"::"text"::"log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "log_logtype_enum"`);
        await queryRunner.query(`ALTER TYPE "log_logtype_enum_old" RENAME TO  "log_logtype_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_8108668f1658b14b9db299634e"`);
        await queryRunner.query(`DROP TABLE "pupil_tutoring_interest_confirmation_request"`);
    }

}
