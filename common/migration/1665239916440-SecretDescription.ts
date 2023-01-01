import {MigrationInterface, QueryRunner} from "typeorm";

export class SecretDescription1665239916440 implements MigrationInterface {
    name = 'SecretDescription1665239916440';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secret" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secret" DROP COLUMN "description"`);
    }

}
