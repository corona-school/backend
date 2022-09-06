import {MigrationInterface, QueryRunner} from "typeorm";

export class addIsRedacted1661440816555 implements MigrationInterface {
    name = 'addIsRedacted1661440816555';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" ADD "isRedacted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "student" ADD "isRedacted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "isRedacted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "isRedacted"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isRedacted"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "isRedacted"`);
    }

}
