import {MigrationInterface, QueryRunner} from "typeorm";

export class ADDATTACHMENTS31659791897439 implements MigrationInterface {
    name = 'ADDATTACHMENTS31659791897439';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "uploaderID" character varying NOT NULL, "filename" character varying NOT NULL, "size" integer NOT NULL, "attachmentGroupId" character varying NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "concrete_notification" ADD "attachmentGroupId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concrete_notification" DROP COLUMN "attachmentGroupId"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
    }

}
