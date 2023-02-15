import {MigrationInterface, QueryRunner} from "typeorm";

export class AboutMe1665846387535 implements MigrationInterface {
    name = 'AboutMe1665846387535';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" ADD "aboutMe" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "student" ADD "aboutMe" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "aboutMe"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "aboutMe"`);
    }

}
