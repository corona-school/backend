import {MigrationInterface, QueryRunner} from "typeorm";

export class IMPROVECOURSES1664805270024 implements MigrationInterface {
    name = 'IMPROVECOURSES1664805270024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "subject" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."course_schooltype_enum" AS ENUM('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other')`);
        await queryRunner.query(`ALTER TABLE "course" ADD "schooltype" "public"."course_schooltype_enum" array NOT NULL DEFAULT '{other}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "schooltype"`);
        await queryRunner.query(`DROP TYPE "public"."course_schooltype_enum"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "subject"`);
    }

}
