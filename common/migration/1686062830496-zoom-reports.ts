import {MigrationInterface, QueryRunner} from "typeorm";

export class zoomReports1686062830496 implements MigrationInterface {
    name = 'zoomReports1686062830496';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" ADD "zoomMeetingReport" json array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "zoomMeetingReport"`);
    }

}
