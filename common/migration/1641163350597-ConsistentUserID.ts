import {MigrationInterface, QueryRunner} from "typeorm";

export class ConsistentUserID1641163350597 implements MigrationInterface {
    name = 'ConsistentUserID1641163350597';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screener" ADD "userID" character varying NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_157bc8d04bf357f137cdec4423" ON "screener" ("userID") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_157bc8d04bf357f137cdec4423"`);
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "userID"`);
    }

}
