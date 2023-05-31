import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConversationIdToSubcourse1685136338879 implements MigrationInterface {
    name = 'AddConversationIdToSubcourse1685136338879';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" ALTER COLUMN "conversationId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" ALTER COLUMN "conversationId"`);
    }
}
