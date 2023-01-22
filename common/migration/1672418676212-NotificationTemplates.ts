import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationTemplates1672418676212 implements MigrationInterface {
    name = 'NotificationTemplates1672418676212';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "category" TO "type"`);
        await queryRunner.query(`CREATE TYPE "public"."message_translation_language_enum" AS ENUM('en', 'de')`);
        await queryRunner.query(
            `CREATE TABLE "message_translation" ("id" SERIAL NOT NULL, "template" json NOT NULL, "language" "public"."message_translation_language_enum" NOT NULL DEFAULT 'de', "notificationId" integer, CONSTRAINT "PK_159f92cfb8a0b269fbc863c74ee" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
        await queryRunner.query(
            `CREATE TYPE "public"."notification_type_enum" AS ENUM('chat', 'survey', 'appointment', 'advice', 'suggestion', 'announcement', 'call', 'news', 'event', 'request', 'alternative', 'account', 'onboarding', 'match', 'course', 'certificate', 'legacy')`
        );
        await queryRunner.query(`ALTER TABLE "notification" ADD "type" "public"."notification_type_enum" NOT NULL DEFAULT 'legacy'`);
        await queryRunner.query(
            `ALTER TABLE "message_translation" ADD CONSTRAINT "FK_5ae486c5ef53f5335af8a4ae260" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_translation" DROP CONSTRAINT "FK_5ae486c5ef53f5335af8a4ae260"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "type" text array NOT NULL`);
        await queryRunner.query(`DROP TABLE "message_translation"`);
        await queryRunner.query(`DROP TYPE "public"."message_translation_language_enum"`);
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "type" TO "category"`);
    }
}
