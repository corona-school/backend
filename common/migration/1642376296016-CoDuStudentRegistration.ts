import {MigrationInterface, QueryRunner} from "typeorm";

export class CoDuStudentRegistration1642376296016 implements MigrationInterface {
    name = 'CoDuStudentRegistration1642376296016';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "isCodu" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isCodu"`);
    }

}
