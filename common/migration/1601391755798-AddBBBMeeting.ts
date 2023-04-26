import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBBBMeeting1601391755798 implements MigrationInterface {
    name = 'AddBBBMeeting1601391755798';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bbb_meeting" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "meetingID" character varying NOT NULL, "meetingName" character varying NOT NULL, "attendeePW" character varying NOT NULL, "moderatorPW" character varying NOT NULL, CONSTRAINT "PK_33f2c503196edee1b2e5899083f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting')`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum" USING "logtype"::"text"::"log_logtype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "log_logtype_enum_old" AS ENUM('accessedByScreener', 'cancelledCourse', 'cancelledSubcourse', 'certificateRequest', 'contactMentor', 'createdCourse', 'createdCourseAttendanceLog', 'deActivate', 'fetchedFromWix', 'matchDissolve', 'misc', 'updatePersonal', 'updateStudentDescription', 'updateSubjects', 'updatedByScreener', 'verificationRequets', 'verified')`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_old" USING "logtype"::"text"::"log_logtype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "log_logtype_enum_old" RENAME TO  "log_logtype_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "bbb_meeting"`, undefined);
    }

}
