import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAuthToken1683457313466 implements MigrationInterface {
    name = 'RemoveAuthToken1683457313466';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5ff14bcaf5fdce75691fa8f34a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b858e5a35c51a4dbf6922025e7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4d0994b549167f69e3cec7c00"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d6c74ee02bc266daf510d3ef2a"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "authTokenUsed"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "authTokenSent"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "authToken"`);
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "authTokenUsed"`);
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "authTokenSent"`);
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "authToken"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "authTokenUsed"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "authTokenSent"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "authToken"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "authTokenUsed"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "authTokenSent"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "authToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" ADD "authToken" character varying`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "authTokenSent" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "authTokenUsed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "student" ADD "authToken" character varying`);
        await queryRunner.query(`ALTER TABLE "student" ADD "authTokenSent" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "student" ADD "authTokenUsed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "screener" ADD "authToken" character varying`);
        await queryRunner.query(`ALTER TABLE "screener" ADD "authTokenSent" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "screener" ADD "authTokenUsed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "authToken" character varying`);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "authTokenSent" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "pupil" ADD "authTokenUsed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d6c74ee02bc266daf510d3ef2a" ON "mentor" ("authToken") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f4d0994b549167f69e3cec7c00" ON "student" ("authToken") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b858e5a35c51a4dbf6922025e7" ON "screener" ("authToken") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5ff14bcaf5fdce75691fa8f34a" ON "pupil" ("authToken") `);
    }
}
