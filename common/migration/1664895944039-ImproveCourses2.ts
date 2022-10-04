import {MigrationInterface, QueryRunner} from "typeorm";

export class ImproveCourses21664895944039 implements MigrationInterface {
    name = 'ImproveCourses21664895944039';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."course_subject_enum" AS ENUM('Mathematik', 'Deutsch', 'Englisch', 'Biologie', 'Chemie', 'Physik', 'Informatik', 'Sachkunde', 'Geschichte', 'Erdkunde', 'Wirtschaft', 'Politik', 'Philosophie', 'Kunst', 'Musik', 'Pädagogik', 'Französisch', 'Latein', 'Altgriechisch', 'Spanisch', 'Italienisch', 'Russisch', 'Niederländisch', 'Deutsch als Zweitsprache')`);
        await queryRunner.query(`ALTER TABLE "course" ADD "subject" "public"."course_subject_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."course_schooltype_enum" AS ENUM('grundschule', 'gesamtschule', 'hauptschule', 'realschule', 'gymnasium', 'förderschule', 'berufsschule', 'other')`);
        await queryRunner.query(`ALTER TABLE "course" ADD "schooltype" "public"."course_schooltype_enum" array NOT NULL DEFAULT '{other}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "schooltype"`);
        await queryRunner.query(`DROP TYPE "public"."course_schooltype_enum"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "subject"`);
        await queryRunner.query(`DROP TYPE "public"."course_subject_enum"`);
    }

}
