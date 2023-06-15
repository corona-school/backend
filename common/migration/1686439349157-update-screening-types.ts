import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateScreeningTypes1686439349157 implements MigrationInterface {
    name = 'updateScreeningTypes1686439349157';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."screening_jobstatus_enum" RENAME TO "screening_jobstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."screening_jobstatus_enum" AS ENUM('Student', 'Pupil', 'Employee', 'Retiree', 'Misc')`);
        await queryRunner.query(
            `ALTER TABLE "screening" ALTER COLUMN "jobStatus" TYPE "public"."screening_jobstatus_enum" USING "jobStatus"::"text"::"public"."screening_jobstatus_enum"`
        );
        await queryRunner.query(`DROP TYPE "public"."screening_jobstatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."screening_jobstatus_enum_old" AS ENUM('Student', 'Pupil', 'Employee', 'Retiree', 'Misc')`);
        await queryRunner.query(
            `ALTER TABLE "screening" ALTER COLUMN "jobStatus" TYPE "public"."screening_jobstatus_enum_old" USING "jobStatus"::"text"::"public"."screening_jobstatus_enum_old"`
        );
        await queryRunner.query(`DROP TYPE "public"."screening_jobstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."screening_jobstatus_enum_old" RENAME TO "screening_jobstatus_enum"`);
    }
}
