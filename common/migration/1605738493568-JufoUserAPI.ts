import {MigrationInterface, QueryRunner} from "typeorm";

export class JufoUserAPI1605738493568 implements MigrationInterface {
    name = 'JufoUserAPI1605738493568';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_match" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dissolved" boolean NOT NULL DEFAULT false, "dissolveReason" integer DEFAULT null, "studentId" integer, "pupilId" integer, CONSTRAINT "UQ_PJ_MATCH" UNIQUE ("studentId", "pupilId"), CONSTRAINT "PK_14902d121cc871092943b3857e5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_58dbaf83a377f347d9fab47fc5" ON "project_match" ("uuid") `, undefined);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'projectMatchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'updateProjectFields', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting')`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum" USING "logtype"::"text"::"log_logtype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "project_match" ADD CONSTRAINT "FK_ec8c8527004e4b21fa92dfde9f4" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "project_match" ADD CONSTRAINT "FK_2f269fd77a19a301eb7c9aaa6b6" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_match" DROP CONSTRAINT "FK_2f269fd77a19a301eb7c9aaa6b6"`, undefined);
        await queryRunner.query(`ALTER TABLE "project_match" DROP CONSTRAINT "FK_ec8c8527004e4b21fa92dfde9f4"`, undefined);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum_old" AS ENUM('accessedByScreener', 'bbbMeeting', 'cancelledCourse', 'cancelledSubcourse', 'certificateRequest', 'contactMentor', 'createdCourse', 'createdCourseAttendanceLog', 'deActivate', 'fetchedFromWix', 'matchDissolve', 'misc', 'updatePersonal', 'updateStudentDescription', 'updateSubjects', 'updatedByScreener', 'verificationRequets', 'verified')`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_old" USING "logtype"::"text"::"log_logtype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "log_logtype_enum_old" RENAME TO  "log_logtype_enum"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_58dbaf83a377f347d9fab47fc5"`, undefined);
        await queryRunner.query(`DROP TABLE "project_match"`, undefined);
    }

}
