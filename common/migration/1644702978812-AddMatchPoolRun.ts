import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMatchPoolRun1644702978812 implements MigrationInterface {
    name = 'AddMatchPoolRun1644702978812';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "match_pool_run" ("id" SERIAL NOT NULL, "runAt" TIMESTAMP NOT NULL DEFAULT now(), "matchingPool" character varying NOT NULL, "matchesCreated" integer NOT NULL, "stats" json NOT NULL, CONSTRAINT "PK_94a8e7729d108dfa44fb65c1a10" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "match_pool_run"`);
    }

}
