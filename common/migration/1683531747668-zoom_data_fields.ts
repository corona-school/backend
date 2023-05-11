import {MigrationInterface, QueryRunner} from "typeorm";

export class zoomDataFields1683531747668 implements MigrationInterface {
    name = 'zoomDataFields1683531747668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" ADD "zoomMeetingId" character varying`);
        await queryRunner.query(`ALTER TABLE "student" ADD "zoomUserId" character varying`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "mentor" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "zoomUserId"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "zoomMeetingId"`);
    }

}
