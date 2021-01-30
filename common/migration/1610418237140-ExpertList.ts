import {MigrationInterface, QueryRunner} from "typeorm";

export class ExpertList1610418237140 implements MigrationInterface {
    name = 'ExpertList1610418237140';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expertise_tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_4251b103cf2216af06b5c8625f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_29beceeebc3a1eae3d78939713" ON "expertise_tag" ("name") `);
        await queryRunner.query(`CREATE TYPE "expert_data_allowed_enum" AS ENUM('pending', 'yes', 'no')`);
        await queryRunner.query(`CREATE TABLE "expert_data" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contactEmail" character varying NOT NULL, "description" character varying, "active" boolean NOT NULL DEFAULT false, "allowed" "expert_data_allowed_enum" NOT NULL DEFAULT 'pending', "studentId" integer, CONSTRAINT "REL_0bf0d1a1e138fd47f60e263524" UNIQUE ("studentId"), CONSTRAINT "PK_096e6e0f8fcc7e142b555fde91e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expert_data_expertise_tags_expertise_tag" ("expertDataId" integer NOT NULL, "expertiseTagId" integer NOT NULL, CONSTRAINT "PK_bc62a3cbf8ed9f07fc7e43163d4" PRIMARY KEY ("expertDataId", "expertiseTagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_73044a211048e72c2026425c81" ON "expert_data_expertise_tags_expertise_tag" ("expertDataId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a81e80d1d580b868ed36ca123" ON "expert_data_expertise_tags_expertise_tag" ("expertiseTagId") `);
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'projectMatchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'updateProjectFields', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest', 'cancelledCourse', 'cancelledSubcourse', 'createdCourseAttendanceLog', 'contactMentor', 'bbbMeeting', 'contactExpert', 'participantJoinedCourse', 'participantLeftCourse', 'participantJoinedWaitingList', 'participantLeftWaitingList', 'userAccessedCourseWhileAuthenticated')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum" USING "logtype"::"text"::"log_logtype_enum"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "expert_data" ADD CONSTRAINT "FK_0bf0d1a1e138fd47f60e2635247" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expert_data_expertise_tags_expertise_tag" ADD CONSTRAINT "FK_73044a211048e72c2026425c81c" FOREIGN KEY ("expertDataId") REFERENCES "expert_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expert_data_expertise_tags_expertise_tag" ADD CONSTRAINT "FK_8a81e80d1d580b868ed36ca1234" FOREIGN KEY ("expertiseTagId") REFERENCES "expertise_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expert_data_expertise_tags_expertise_tag" DROP CONSTRAINT "FK_8a81e80d1d580b868ed36ca1234"`);
        await queryRunner.query(`ALTER TABLE "expert_data_expertise_tags_expertise_tag" DROP CONSTRAINT "FK_73044a211048e72c2026425c81c"`);
        await queryRunner.query(`ALTER TABLE "expert_data" DROP CONSTRAINT "FK_0bf0d1a1e138fd47f60e2635247"`);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum_old" AS ENUM('accessedByScreener', 'bbbMeeting', 'cancelledCourse', 'cancelledSubcourse', 'certificateRequest', 'contactMentor', 'createdCourse', 'createdCourseAttendanceLog', 'deActivate', 'fetchedFromWix', 'matchDissolve', 'misc', 'participantJoinedCourse', 'participantJoinedWaitingList', 'participantLeftCourse', 'participantLeftWaitingList', 'projectMatchDissolve', 'updatePersonal', 'updateProjectFields', 'updateStudentDescription', 'updateSubjects', 'updatedByScreener', 'userAccessedCourseWhileAuthenticated', 'verificationRequets', 'verified')`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_old" USING "logtype"::"text"::"log_logtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`);
        await queryRunner.query(`DROP TYPE "log_logtype_enum"`);
        await queryRunner.query(`ALTER TYPE "log_logtype_enum_old" RENAME TO  "log_logtype_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_8a81e80d1d580b868ed36ca123"`);
        await queryRunner.query(`DROP INDEX "IDX_73044a211048e72c2026425c81"`);
        await queryRunner.query(`DROP TABLE "expert_data_expertise_tags_expertise_tag"`);
        await queryRunner.query(`DROP TABLE "expert_data"`);
        await queryRunner.query(`DROP TYPE "expert_data_allowed_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_29beceeebc3a1eae3d78939713"`);
        await queryRunner.query(`DROP TABLE "expertise_tag"`);
    }

}
