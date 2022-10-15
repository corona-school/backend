import {MigrationInterface, QueryRunner} from "typeorm";

export class Campaigns1665853107967 implements MigrationInterface {
    name = 'Campaigns1665853107967';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "sample_context" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "sample_context"`);
    }

}
