import {MigrationInterface, QueryRunner} from "typeorm";

export class DrehtuerSprint11609798407823 implements MigrationInterface {
    name = 'DrehtuerSprint11609798407823';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" RENAME COLUMN "imageUrl" TO "imageKey"`, undefined);
        await queryRunner.query(`CREATE TYPE "student_registrationsource_enum" AS ENUM('0', '1', '2', '3')`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "registrationSource" "student_registrationsource_enum" NOT NULL DEFAULT '0'`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."pupil_registrationsource_enum" RENAME TO "pupil_registrationsource_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "pupil_registrationsource_enum" AS ENUM('0', '1', '2', '3')`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" TYPE "pupil_registrationsource_enum" USING "registrationSource"::"text"::"pupil_registrationsource_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" SET DEFAULT '0'`, undefined);
        await queryRunner.query(`DROP TYPE "pupil_registrationsource_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "pupil_registrationsource_enum_old" AS ENUM('0', '1', '2')`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" TYPE "pupil_registrationsource_enum_old" USING "registrationSource"::"text"::"pupil_registrationsource_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "registrationSource" SET DEFAULT '0'`, undefined);
        await queryRunner.query(`DROP TYPE "pupil_registrationsource_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "pupil_registrationsource_enum_old" RENAME TO  "pupil_registrationsource_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "registrationSource"`, undefined);
        await queryRunner.query(`DROP TYPE "student_registrationsource_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" RENAME COLUMN "imageKey" TO "imageUrl"`, undefined);
    }

}
