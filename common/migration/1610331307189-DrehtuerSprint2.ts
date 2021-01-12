import {MigrationInterface, QueryRunner} from "typeorm";

export class DrehtuerSprint21610331307189 implements MigrationInterface {
    name = 'DrehtuerSprint21610331307189';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subcourse_waiting_list_pupil" ("subcourseId" integer NOT NULL, "pupilId" integer NOT NULL, CONSTRAINT "PK_b35d059abbd7f4c4a1147f72ec9" PRIMARY KEY ("subcourseId", "pupilId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df9eb9663f8085da35f7ca5547" ON "subcourse_waiting_list_pupil" ("subcourseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3bd25f377afc44f574f7ac3d09" ON "subcourse_waiting_list_pupil" ("pupilId") `);
        await queryRunner.query(`ALTER TABLE "course" ADD "allowContact" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "course" ADD "correspondentId" integer`);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'projectMatchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'updateProjectFields', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting', 'participantJoinedCourse', 'participantLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum" USING "logtype"::"text"::"log_logtype_enum"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_0682a6fe3bace3ed13377c1b1ca" FOREIGN KEY ("correspondentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subcourse_waiting_list_pupil" ADD CONSTRAINT "FK_df9eb9663f8085da35f7ca55471" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subcourse_waiting_list_pupil" ADD CONSTRAINT "FK_3bd25f377afc44f574f7ac3d09b" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse_waiting_list_pupil" DROP CONSTRAINT "FK_3bd25f377afc44f574f7ac3d09b"`);
        await queryRunner.query(`ALTER TABLE "subcourse_waiting_list_pupil" DROP CONSTRAINT "FK_df9eb9663f8085da35f7ca55471"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_0682a6fe3bace3ed13377c1b1ca"`);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum_old" AS ENUM('accessedByScreener', 'bbbMeeting', 'cancelledCourse', 'cancelledSubcourse', 'certificateRequest', 'contactMentor', 'createdCourse', 'createdCourseAttendanceLog', 'deActivate', 'fetchedFromWix', 'matchDissolve', 'misc', 'projectMatchDissolve', 'updatePersonal', 'updateProjectFields', 'updateStudentDescription', 'updateSubjects', 'updatedByScreener', 'verificationRequets', 'verified')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_old" USING "logtype"::"text"::"log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "log_logtype_enum"`);
        await queryRunner.query(`ALTER TYPE "log_logtype_enum_old" RENAME TO  "log_logtype_enum"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "correspondentId"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "allowContact"`);
        await queryRunner.query(`DROP INDEX "IDX_3bd25f377afc44f574f7ac3d09"`);
        await queryRunner.query(`DROP INDEX "IDX_df9eb9663f8085da35f7ca5547"`);
        await queryRunner.query(`DROP TABLE "subcourse_waiting_list_pupil"`);
    }

}
