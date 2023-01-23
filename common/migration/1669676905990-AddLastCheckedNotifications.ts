import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastCheckedNotifications1669676905990 implements MigrationInterface {
    name = 'AddLastCheckedNotifications1669676905990';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" ADD "lastTimeCheckedNotifications" TIMESTAMP DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "screener" ADD "lastTimeCheckedNotifications" TIMESTAMP DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "student" ADD "lastTimeCheckedNotifications" TIMESTAMP DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "lastTimeCheckedNotifications" TIMESTAMP DEFAULT '"1970-01-01T00:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "lastTimeCheckedNotifications"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "lastTimeCheckedNotifications"`);
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "lastTimeCheckedNotifications"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "lastTimeCheckedNotifications"`);
    }
}
