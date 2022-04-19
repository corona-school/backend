import {MigrationInterface, QueryRunner} from "typeorm";

export class SaveMatchPoolInMatch1650374852905 implements MigrationInterface {
    name = 'SaveMatchPoolInMatch1650374852905';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" ADD "matchPool" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "matchPool"`);
    }

}
