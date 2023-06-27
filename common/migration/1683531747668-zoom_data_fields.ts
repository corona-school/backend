import {MigrationInterface, QueryRunner} from "typeorm";

export class zoomDataFields1683531747668 implements MigrationInterface {
    name = 'zoomDataFields1683531747668';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" ADD "zoomMeetingId" character varying`);
        await queryRunner.query(`ALTER TABLE "student" ADD "zoomUserId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "zoomUserId"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "zoomMeetingId"`);
    }

}
