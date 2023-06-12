import { MigrationInterface, QueryRunner } from 'typeorm';

export class chatTypeEnum1686567733355 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."chat_type" RENAME TO "old_chat_type"`);
        await queryRunner.query(`CREATE TYPE "public"."chat_type" AS ENUM('chat', 'announcement')`);

        await queryRunner.query(
            `ALTER TABLE "subcourse" ALTER COLUMN "groupChatType" TYPE "public"."chat_type" USING "groupChatType"::text::"public"."chat_type"`
        );

        await queryRunner.query(`DROP TYPE "public"."old_chat_type"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."chat_type" RENAME TO "new_chat_type"`);
        await queryRunner.query(`CREATE TYPE "public"."chat_type" AS ENUM('chat', 'announcement')`);

        await queryRunner.query(
            `ALTER TABLE "subcourse" ALTER COLUMN "groupChatType" TYPE "public"."chat_type" USING "groupChatType"::text::"public"."chat_type"`
        );

        await queryRunner.query(`DROP TYPE "public"."new_chat_type"`);
    }
}
