import {MigrationInterface, QueryRunner} from "typeorm";

export class AddInstructorScreening1592477604748 implements MigrationInterface {
    name = 'AddInstructorScreening1592477604748';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "instructor_screening" ("id" SERIAL NOT NULL, "success" boolean NOT NULL, "comment" character varying, "knowsCoronaSchoolFrom" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "screenerId" integer, "studentId" integer, CONSTRAINT "REL_e176665fa769d2e603d825f6fa" UNIQUE ("studentId"), CONSTRAINT "PK_e29a51f8dce0a07d2e1dba73636" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "sentInstructorScreeningReminderCount" integer NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "lastSentInstructorScreeningInvitationDate" TIMESTAMP DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "instructor_screening" ADD CONSTRAINT "FK_ef1d3e862feda89b92fddcdbb34" FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "instructor_screening" ADD CONSTRAINT "FK_e176665fa769d2e603d825f6fa3" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor_screening" DROP CONSTRAINT "FK_e176665fa769d2e603d825f6fa3"`, undefined);
        await queryRunner.query(`ALTER TABLE "instructor_screening" DROP CONSTRAINT "FK_ef1d3e862feda89b92fddcdbb34"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "lastSentInstructorScreeningInvitationDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "sentInstructorScreeningReminderCount"`, undefined);
        await queryRunner.query(`DROP TABLE "instructor_screening"`, undefined);
    }

}
