import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCoCCancel1683835406980 implements MigrationInterface {
    name = 'AddCoCCancel1683835406980';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'projectMatchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'updateProjectFields', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cocCancel', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting', 'contactExpert', 'participantJoinedCourse', 'participantLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated', 'instructorIssuedCertificate', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestStatusChange')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "public"."log_logtype_enum" USING "logtype"::"text"::"public"."log_logtype_enum"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "public"."log_logtype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."log_logtype_enum_old" AS ENUM('accessedByScreener', 'bbbMeeting', 'cancelledCourse', 'cancelledSubcourse', 'certificateRequest', 'contactExpert', 'contactMentor', 'createdCourse', 'createdCourseAttendanceLog', 'deActivate', 'fetchedFromWix', 'instructorIssuedCertificate', 'matchDissolve', 'misc', 'participantJoinedCourse', 'participantJoinedWaitingList', 'participantLeftCourse', 'participantLeftWaitingList', 'projectMatchDissolve', 'pupilInterestConfirmationRequestReminderSent', 'pupilInterestConfirmationRequestSent', 'pupilInterestConfirmationRequestStatusChange', 'updatePersonal', 'updateProjectFields', 'updateStudentDescription', 'updateSubjects', 'updatedByScreener', 'userAccessedCourseWhileAuthenticated', 'verificationRequets', 'verified')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "public"."log_logtype_enum_old" USING "logtype"::"text"::"public"."log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "public"."log_logtype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum_old" RENAME TO "log_logtype_enum"`);
    }

}
