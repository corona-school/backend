import { MigrationInterface, QueryRunner } from 'typeorm';

export class chatTypeEnum1686567733355 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."chat_type" AS ENUM('chat', 'announcement')`);
        await queryRunner.query(`ALTER TABLE "subcourse" ADD "groupChatType" "public"."chat_type" NOT NULL DEFAULT 'course'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TYPE "public"."chat_type"`);
    }
}
