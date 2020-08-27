import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCourseAttendanceLog1598494023999 implements MigrationInterface {
    name = 'AddCourseAttendanceLog1598494023999';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_attendance_log" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attendedTime" integer, "ip" character varying, "pupilId" integer, "lectureId" integer, CONSTRAINT "PK_c3906899bb64b97b840ea1f2656" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog')`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum" USING "logtype"::"text"::"log_logtype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "course_attendance_log" ADD CONSTRAINT "FK_acc59dc4321a888376f7fad5a3d" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "course_attendance_log" ADD CONSTRAINT "FK_927959c3480126ecdceeae26609" FOREIGN KEY ("lectureId") REFERENCES "lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_attendance_log" DROP CONSTRAINT "FK_927959c3480126ecdceeae26609"`, undefined);
        await queryRunner.query(`ALTER TABLE "course_attendance_log" DROP CONSTRAINT "FK_acc59dc4321a888376f7fad5a3d"`, undefined);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum_old" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cancelledCourse', 'cancelledSubcourse')`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_old" USING "logtype"::"text"::"log_logtype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "log_logtype_enum_old" RENAME TO  "log_logtype_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "course_attendance_log"`, undefined);
    }

}
