import {MigrationInterface, QueryRunner} from "typeorm";

export class LernFairPlus1648490969730 implements MigrationInterface {
    name = 'LernFairPlus1648490969730';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pupil_registrationsource_enum" RENAME TO "pupil_registrationsource_enum_old"`);
        await queryRunner.query(`CREATE TYPE "pupil_registrationsource_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" TYPE "pupil_registrationsource_enum" USING "registrationSource"::"text"::"pupil_registrationsource_enum"`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "pupil_registrationsource_enum_old"`);

        await queryRunner.query(`ALTER TYPE "public"."student_registrationsource_enum" RENAME TO "student_registrationsource_enum_old"`);
        await queryRunner.query(`CREATE TYPE "student_registrationsource_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "registrationSource" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "registrationSource" TYPE "student_registrationsource_enum" USING "registrationSource"::"text"::"student_registrationsource_enum"`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "registrationSource" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "student_registrationsource_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "student_registrationsource_enum_old" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "registrationSource" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "registrationSource" TYPE "student_registrationsource_enum_old" USING "registrationSource"::"text"::"student_registrationsource_enum_old"`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "registrationSource" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "student_registrationsource_enum"`);
        await queryRunner.query(`ALTER TYPE "student_registrationsource_enum_old" RENAME TO  "student_registrationsource_enum"`);

        await queryRunner.query(`CREATE TYPE "pupil_registrationsource_enum_old" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" TYPE "pupil_registrationsource_enum_old" USING "registrationSource"::"text"::"pupil_registrationsource_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "pupil_registrationsource_enum"`);
        await queryRunner.query(`ALTER TYPE "pupil_registrationsource_enum_old" RENAME TO  "pupil_registrationsource_enum"`);
    }

}