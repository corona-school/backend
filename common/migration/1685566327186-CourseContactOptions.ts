import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseContactOptions1685566327186 implements MigrationInterface {
    name = 'CourseContactOptions1685566327186';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" ADD "allowChatContactProspects" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "subcourse" ADD "allowChatContactParticipants" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE TYPE "public"."chat_type" AS ENUM('NORMAL', 'ANNOUNCEMENT')`);
        await queryRunner.query(`ALTER TABLE "subcourse" ADD "groupChatType" "public"."chat_type" NOT NULL DEFAULT 'NORMAL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" DROP COLUMN "groupChatType"`);
        await queryRunner.query(`DROP TYPE "public"."chat_type"`);
        await queryRunner.query(`ALTER TABLE "subcourse" DROP COLUMN "allowChatContactParticipants"`);
        await queryRunner.query(`ALTER TABLE "subcourse" DROP COLUMN "allowChatContactProspects"`);
    }
}
