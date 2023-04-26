import {MigrationInterface, QueryRunner} from "typeorm";

export class DaZ1615777688649 implements MigrationInterface {
    name = 'DaZ1615777688649';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "pupil_languages_enum" AS ENUM('Albanisch', 'Arabisch', 'Armenisch', 'Aserbaidschanisch', 'Bosnisch', 'Bulgarisch', 'Chinesisch', 'Deutsch', 'Englisch', 'Französisch', 'Italienisch', 'Kasachisch', 'Kurdisch', 'Polnisch', 'Portugiesisch', 'Russisch', 'Türkisch', 'Spanisch', 'Ukrainisch', 'Vietnamesisch', 'Andere')`);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "languages" "pupil_languages_enum" array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`CREATE TYPE "pupil_learninggermansince_enum" AS ENUM('>4', '2-4', '1-2', '<1')`);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "learningGermanSince" "pupil_learninggermansince_enum"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "supportsInDaZ" boolean`);
        await queryRunner.query(`CREATE TYPE "student_languages_enum" AS ENUM('Albanisch', 'Arabisch', 'Armenisch', 'Aserbaidschanisch', 'Bosnisch', 'Bulgarisch', 'Chinesisch', 'Deutsch', 'Englisch', 'Französisch', 'Italienisch', 'Kasachisch', 'Kurdisch', 'Polnisch', 'Portugiesisch', 'Russisch', 'Türkisch', 'Spanisch', 'Ukrainisch', 'Vietnamesisch', 'Andere')`);
        await queryRunner.query(`ALTER TABLE "student" ADD "languages" "student_languages_enum" array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "languages"`);
        await queryRunner.query(`DROP TYPE "student_languages_enum"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "supportsInDaZ"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "learningGermanSince"`);
        await queryRunner.query(`DROP TYPE "pupil_learninggermansince_enum"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "languages"`);
        await queryRunner.query(`DROP TYPE "pupil_languages_enum"`);
    }

}
