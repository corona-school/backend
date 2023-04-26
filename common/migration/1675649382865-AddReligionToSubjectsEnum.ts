import {MigrationInterface, QueryRunner} from "typeorm";

export class AddReligionToSubjectsEnum1675649382865 implements MigrationInterface {
    name = 'AddReligionToSubjectsEnum1675649382865';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."course_subject_enum" RENAME TO "course_subject_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."course_subject_enum" AS ENUM('Mathematik', 'Deutsch', 'Englisch', 'Biologie', 'Chemie', 'Physik', 'Informatik', 'Sachkunde', 'Geschichte', 'Erdkunde', 'Wirtschaft', 'Politik', 'Philosophie', 'Kunst', 'Musik', 'Pädagogik', 'Französisch', 'Latein', 'Altgriechisch', 'Spanisch', 'Italienisch', 'Russisch', 'Niederländisch', 'Deutsch als Zweitsprache', 'Religion')`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "subject" TYPE "public"."course_subject_enum" USING "subject"::"text"::"public"."course_subject_enum"`);
        await queryRunner.query(`DROP TYPE "public"."course_subject_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."course_subject_enum_old" AS ENUM('Altgriechisch', 'Biologie', 'Chemie', 'Deutsch', 'Deutsch als Zweitsprache', 'Englisch', 'Erdkunde', 'Französisch', 'Geschichte', 'Informatik', 'Italienisch', 'Kunst', 'Latein', 'Mathematik', 'Musik', 'Niederländisch', 'Philosophie', 'Physik', 'Politik', 'Pädagogik', 'Russisch', 'Sachkunde', 'Spanisch', 'Wirtschaft')`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "subject" TYPE "public"."course_subject_enum_old" USING "subject"::"text"::"public"."course_subject_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."course_subject_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."course_subject_enum_old" RENAME TO "course_subject_enum"`);
    }

}
