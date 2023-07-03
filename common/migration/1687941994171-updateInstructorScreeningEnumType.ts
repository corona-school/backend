import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateInstructorScreeningEnumType1687941994171 implements MigrationInterface {
    name = 'updateInstructorScreeningEnumType1687941994171';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "instructor_screening" ALTER COLUMN "jobStatus" TYPE "public"."screening_jobstatus_enum" USING "jobStatus"::"text"::"public"."screening_jobstatus_enum"`
        );
        await queryRunner.query(`DROP TYPE "public"."instructor_screening_jobstatus_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."instructor_screening_jobstatus_enum" AS ENUM('Schüler:in', 'Student:in', 'Angestellte:r', 'Rentner:in', 'Sonstige')`
        );
        await queryRunner.query(
            `ALTER TABLE "instructor_screening" ALTER COLUMN "jobStatus" TYPE "public"."instructor_screening_jobstatus_enum" USING "jobStatus"::"text"::"public"."instructor_screening_jobstatus_enum"`
        );
    }
}
