import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDetailedScreeningData1686349982361 implements MigrationInterface {
    name = 'addDetailedScreeningData1686349982361';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."screening_jobstatus_enum" AS ENUM('Schüler:in', 'Student:in', 'Angestellte:r', 'Rentner:in', 'Sonstige')`
        );
        await queryRunner.query(`ALTER TABLE "screening" ADD "jobStatus" "public"."screening_jobstatus_enum"`);
        await queryRunner.query(
            `CREATE TYPE "public"."instructor_screening_jobstatus_enum" AS ENUM('Schüler:in', 'Student:in', 'Angestellte:r', 'Rentner:in', 'Sonstige')`
        );
        await queryRunner.query(`ALTER TABLE "instructor_screening" ADD "jobStatus" "public"."instructor_screening_jobstatus_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor_screening" DROP COLUMN "jobStatus"`);
        await queryRunner.query(`DROP TYPE "public"."instructor_screening_jobstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "jobStatus"`);
        await queryRunner.query(`DROP TYPE "public"."screening_jobstatus_enum"`);
    }
}
