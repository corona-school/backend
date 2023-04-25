import {MigrationInterface, QueryRunner} from "typeorm";

export class appointments1682408426422 implements MigrationInterface {
    name = 'appointments1682408426422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "meetingLink"`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "organizers" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "participants" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "declinedBy" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'projectMatchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'updateProjectFields', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cocCancel', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting', 'contactExpert', 'participantJoinedCourse', 'participantLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated', 'instructorIssuedCertificate', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestStatusChange')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "public"."log_logtype_enum" USING "logtype"::"text"::"public"."log_logtype_enum"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "public"."log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "mentor" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`CREATE TYPE "public"."log_logtype_enum_old" AS ENUM('accessedByScreener', 'bbbMeeting', 'cancelledCourse', 'cancelledSubcourse', 'certificateRequest', 'contactExpert', 'contactMentor', 'createdCourse', 'createdCourseAttendanceLog', 'deActivate', 'fetchedFromWix', 'instructorIssuedCertificate', 'matchDissolve', 'misc', 'participantJoinedCourse', 'participantJoinedWaitingList', 'participantLeftCourse', 'participantLeftWaitingList', 'projectMatchDissolve', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestStatusChange', 'updatePersonal', 'updateProjectFields', 'updateStudentDescription', 'updateSubjects', 'updatedByScreener', 'userAccessedCourseWhileAuthenticated', 'verificationRequets', 'verified')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "public"."log_logtype_enum_old" USING "logtype"::"text"::"public"."log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "public"."log_logtype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum_old" RENAME TO "log_logtype_enum"`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "declinedBy"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "participants"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "organizers"`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "meetingLink" character varying`);
    }

}
