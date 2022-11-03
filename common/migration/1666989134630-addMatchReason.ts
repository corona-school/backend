import {MigrationInterface, QueryRunner} from "typeorm";

export class addMatchReason1666989134630 implements MigrationInterface {
    name = 'addMatchReason1666989134630';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" ADD "matchReason" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "matchReason"`);
    }

}
