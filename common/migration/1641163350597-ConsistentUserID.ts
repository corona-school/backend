import {MigrationInterface, QueryRunner} from "typeorm";

export class ConsistentUserID1641163350597 implements MigrationInterface {
    name = 'ConsistentUserID1641163350597';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create new column
        await queryRunner.query(`ALTER TABLE "screener" ADD "userID" character varying`);
        // Fill with new UUIDs
        await queryRunner.query(`UPDATE "screener" SET "userID" = gen_random_uuid ()`);

        // As now all screeners should have a userID, uniqueness constraints can be enforced
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "userID" SET NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_157bc8d04bf357f137cdec4423" ON "screener" ("userID") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_157bc8d04bf357f137cdec4423"`);
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "userID"`);
    }

}
