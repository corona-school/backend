import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNotificationPreferences1670078631264 implements MigrationInterface {
    name = 'AddNotificationPreferences1670078631264';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" ADD "notificationPreferences" json`);
        await queryRunner.query(`ALTER TABLE "screener" ADD "notificationPreferences" json`);
        await queryRunner.query(`ALTER TABLE "student" ADD "notificationPreferences" json`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "notificationPreferences" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "notificationPreferences"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "notificationPreferences"`);
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "notificationPreferences"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "notificationPreferences"`);
    }

}
