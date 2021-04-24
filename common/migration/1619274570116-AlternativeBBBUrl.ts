import {MigrationInterface, QueryRunner} from "typeorm";

export class AlternativeBBBUrl1619274570116 implements MigrationInterface {
    name = 'AlternativeBBBUrl1619274570116';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bbb_meeting" ADD "alternativeUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "bbb_meeting" ALTER COLUMN "meetingName" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "bbb_meeting"."meetingName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "bbb_meeting" ALTER COLUMN "attendeePW" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "bbb_meeting"."attendeePW" IS NULL`);
        await queryRunner.query(`ALTER TABLE "bbb_meeting" ALTER COLUMN "moderatorPW" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "bbb_meeting"."moderatorPW" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "bbb_meeting"."moderatorPW" IS NULL`);
        await queryRunner.query(`ALTER TABLE "bbb_meeting" ALTER COLUMN "moderatorPW" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "bbb_meeting"."attendeePW" IS NULL`);
        await queryRunner.query(`ALTER TABLE "bbb_meeting" ALTER COLUMN "attendeePW" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "bbb_meeting"."meetingName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "bbb_meeting" ALTER COLUMN "meetingName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bbb_meeting" DROP COLUMN "alternativeUrl"`);
    }

}
