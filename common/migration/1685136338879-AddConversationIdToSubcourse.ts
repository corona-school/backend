import {MigrationInterface, QueryRunner} from "typeorm";

export class AddConversationIdToSubcourse1685136338879 implements MigrationInterface {
    name = 'AddConversationIdToSubcourse1685136338879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" ALTER COLUMN "conversationId" DROP DEFAULT`);
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
        await queryRunner.query(`ALTER TABLE "subcourse" ALTER COLUMN "conversationId" SET DEFAULT false`);
    }

}
