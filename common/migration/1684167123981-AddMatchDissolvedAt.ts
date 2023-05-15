import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMatchDissolvedAt1684167123981 implements MigrationInterface {
    name = 'AddMatchDissolvedAt1684167123981';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" ADD "dissolvedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "dissolvedAt"`);
    }

}
