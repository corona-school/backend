import {MigrationInterface, QueryRunner} from "typeorm";

export class JufoAndEverythingQueueScreening1604251169388 implements MigrationInterface {
    name = 'JufoAndEverythingQueueScreening1604251169388';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "project_field_with_grade_restriction_projectfield_enum" AS ENUM('Arbeitswelt', 'Biologie', 'Chemie', 'Geo-und-Raumwissenschaften', 'Mathematik/Informatik', 'Physik', 'Technik')`, undefined);
        await queryRunner.query(`CREATE TABLE "project_field_with_grade_restriction" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectField" "project_field_with_grade_restriction_projectfield_enum" NOT NULL, "min" integer DEFAULT null, "max" integer DEFAULT null, "studentId" integer NOT NULL, CONSTRAINT "UQ_PROJECT_FIELDS" UNIQUE ("projectField", "studentId"), CONSTRAINT "PK_9f450f4d0e5e20c5a0a6fee6dea" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "project_coaching_screening" ("id" SERIAL NOT NULL, "success" boolean NOT NULL, "comment" character varying, "knowsCoronaSchoolFrom" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "screenerId" integer, "studentId" integer, CONSTRAINT "REL_565d757e2fd9a97fc3f30f5129" UNIQUE ("studentId"), CONSTRAINT "PK_4a1d3d3d6f0fa2b36c8347e357c" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "jufo_verification_transmission" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "uuid" character varying NOT NULL, "studentId" integer, CONSTRAINT "REL_1ceddec34e7b90cdbb85ff9738" UNIQUE ("studentId"), CONSTRAINT "PK_3e81acd237ad0b7e97003c835d8" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "isProjectCoachee" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`CREATE TYPE "pupil_projectfields_enum" AS ENUM('Arbeitswelt', 'Biologie', 'Chemie', 'Geo-und-Raumwissenschaften', 'Mathematik/Informatik', 'Physik', 'Technik')`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "projectFields" "pupil_projectfields_enum" array NOT NULL DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "isJufoParticipant" character varying NOT NULL DEFAULT 'unsure'`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "openProjectMatchRequestCount" integer NOT NULL DEFAULT 1`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "projectMemberCount" integer NOT NULL DEFAULT 1`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "isProjectCoach" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "wasJufoParticipant" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "hasJufoCertificate" boolean DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "jufoPastParticipationInfo" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "jufoPastParticipationConfirmed" boolean DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "isUniversityStudent" boolean DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "openProjectMatchRequestCount" integer NOT NULL DEFAULT 1`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "sentJufoAlumniScreeningReminderCount" integer NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "lastSentJufoAlumniScreeningInvitationDate" TIMESTAMP DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."school_schooltype_enum" RENAME TO "school_schooltype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "school_schooltype_enum" AS ENUM('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other')`, undefined);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "schooltype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "schooltype" TYPE "school_schooltype_enum" USING "schooltype"::"text"::"school_schooltype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "schooltype" SET DEFAULT 'other'`, undefined);
        await queryRunner.query(`DROP TYPE "school_schooltype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."pupil_schooltype_enum" RENAME TO "pupil_schooltype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "pupil_schooltype_enum" AS ENUM('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other')`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "schooltype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "schooltype" TYPE "pupil_schooltype_enum" USING "schooltype"::"text"::"pupil_schooltype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "schooltype" SET DEFAULT 'other'`, undefined);
        await queryRunner.query(`DROP TYPE "pupil_schooltype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "project_field_with_grade_restriction" ADD CONSTRAINT "FK_8cdc7fe37faa309976893b8ad07" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "project_coaching_screening" ADD CONSTRAINT "FK_91fa06e6e9aa04b5da93d034cae" FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "project_coaching_screening" ADD CONSTRAINT "FK_565d757e2fd9a97fc3f30f51297" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "jufo_verification_transmission" ADD CONSTRAINT "FK_1ceddec34e7b90cdbb85ff9738f" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jufo_verification_transmission" DROP CONSTRAINT "FK_1ceddec34e7b90cdbb85ff9738f"`, undefined);
        await queryRunner.query(`ALTER TABLE "project_coaching_screening" DROP CONSTRAINT "FK_565d757e2fd9a97fc3f30f51297"`, undefined);
        await queryRunner.query(`ALTER TABLE "project_coaching_screening" DROP CONSTRAINT "FK_91fa06e6e9aa04b5da93d034cae"`, undefined);
        await queryRunner.query(`ALTER TABLE "project_field_with_grade_restriction" DROP CONSTRAINT "FK_8cdc7fe37faa309976893b8ad07"`, undefined);
        await queryRunner.query(`CREATE TYPE "pupil_schooltype_enum_old" AS ENUM('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'other')`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "schooltype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "schooltype" TYPE "pupil_schooltype_enum_old" USING "schooltype"::"text"::"pupil_schooltype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "schooltype" SET DEFAULT 'other'`, undefined);
        await queryRunner.query(`DROP TYPE "pupil_schooltype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "pupil_schooltype_enum_old" RENAME TO  "pupil_schooltype_enum"`, undefined);
        await queryRunner.query(`CREATE TYPE "school_schooltype_enum_old" AS ENUM('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'other')`, undefined);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "schooltype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "schooltype" TYPE "school_schooltype_enum_old" USING "schooltype"::"text"::"school_schooltype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "schooltype" SET DEFAULT 'other'`, undefined);
        await queryRunner.query(`DROP TYPE "school_schooltype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "school_schooltype_enum_old" RENAME TO  "school_schooltype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "lastSentJufoAlumniScreeningInvitationDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "sentJufoAlumniScreeningReminderCount"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "openProjectMatchRequestCount"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isUniversityStudent"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "jufoPastParticipationConfirmed"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "jufoPastParticipationInfo"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "hasJufoCertificate"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "wasJufoParticipant"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isProjectCoach"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "projectMemberCount"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "openProjectMatchRequestCount"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "isJufoParticipant"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "projectFields"`, undefined);
        await queryRunner.query(`DROP TYPE "pupil_projectfields_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "isProjectCoachee"`, undefined);
        await queryRunner.query(`DROP TABLE "jufo_verification_transmission"`, undefined);
        await queryRunner.query(`DROP TABLE "project_coaching_screening"`, undefined);
        await queryRunner.query(`DROP TABLE "project_field_with_grade_restriction"`, undefined);
        await queryRunner.query(`DROP TYPE "project_field_with_grade_restriction_projectfield_enum"`, undefined);
    }

}
