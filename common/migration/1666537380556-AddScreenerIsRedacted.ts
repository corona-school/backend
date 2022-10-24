import {MigrationInterface, QueryRunner} from "typeorm";

export class AddScreenerIsRedacted1666537380556 implements MigrationInterface {
    name = 'AddScreenerIsRedacted1666537380556';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screener" ADD "isRedacted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "isRedacted"`);
    }

}
