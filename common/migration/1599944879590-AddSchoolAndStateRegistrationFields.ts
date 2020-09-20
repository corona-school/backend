import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSchoolAndStateRegistrationFields1599944879590 implements MigrationInterface {
    name = 'AddSchoolAndStateRegistrationFields1599944879590';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "school_state_enum" AS ENUM('bw', 'by', 'be', 'bb', 'hb', 'hh', 'he', 'mv', 'ni', 'nw', 'rp', 'sl', 'sn', 'st', 'sh', 'th', 'other')`, undefined);
        await queryRunner.query(`CREATE TYPE "school_schooltype_enum" AS ENUM('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'other')`, undefined);
        await queryRunner.query(`CREATE TABLE "school" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "website" character varying, "emailDomain" character varying NOT NULL, "state" "school_state_enum" DEFAULT 'other', "schooltype" "school_schooltype_enum" NOT NULL DEFAULT 'other', "activeCooperation" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b365d0ef66facdfeb842d45683" ON "school" ("website") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f3f92f9182a7fccc2858fd63cc" ON "school" ("emailDomain") `, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "teacherEmailAddress" character varying DEFAULT null`, undefined);
        await queryRunner.query(`CREATE TYPE "pupil_registrationsource_enum" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "registrationSource" "pupil_registrationsource_enum" NOT NULL DEFAULT '0'`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "schoolId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD CONSTRAINT "FK_ed2282d6491ddb708d5b8f60225" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" DROP CONSTRAINT "FK_ed2282d6491ddb708d5b8f60225"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "schoolId"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "registrationSource"`, undefined);
        await queryRunner.query(`DROP TYPE "pupil_registrationsource_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "teacherEmailAddress"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f3f92f9182a7fccc2858fd63cc"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_b365d0ef66facdfeb842d45683"`, undefined);
        await queryRunner.query(`DROP TABLE "school"`, undefined);
        await queryRunner.query(`DROP TYPE "school_schooltype_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "school_state_enum"`, undefined);
    }

}
