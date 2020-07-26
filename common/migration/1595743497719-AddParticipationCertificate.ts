import {MigrationInterface, QueryRunner} from "typeorm";

export class AddParticipationCertificate1595743497719 implements MigrationInterface {
    name = 'AddParticipationCertificate1595743497719';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "participation_certificate" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "subjects" character varying NOT NULL, "categories" character varying NOT NULL, "certificateDate" TIMESTAMP NOT NULL DEFAULT now(), "startDate" TIMESTAMP NOT NULL DEFAULT now(), "endDate" TIMESTAMP NOT NULL DEFAULT now(), "hoursPerWeek" integer NOT NULL, "hoursTotal" integer NOT NULL, "medium" character varying NOT NULL, "studentId" integer, "pupilId" integer, CONSTRAINT "PK_431b3e203adb26c29ecef120034" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5c7ebcd2f3fc7ed6022a478980" ON "participation_certificate" ("uuid") `, undefined);
        await queryRunner.query(`ALTER TABLE "participation_certificate" ADD CONSTRAINT "FK_b8bb6da6b807a7b382218947647" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "participation_certificate" ADD CONSTRAINT "FK_01437dc10f00eace91b0f93a805" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation_certificate" DROP CONSTRAINT "FK_01437dc10f00eace91b0f93a805"`, undefined);
        await queryRunner.query(`ALTER TABLE "participation_certificate" DROP CONSTRAINT "FK_b8bb6da6b807a7b382218947647"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5c7ebcd2f3fc7ed6022a478980"`, undefined);
        await queryRunner.query(`DROP TABLE "participation_certificate"`, undefined);
    }

}
