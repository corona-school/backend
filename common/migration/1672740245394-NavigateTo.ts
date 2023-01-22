import { MigrationInterface, QueryRunner } from 'typeorm';

export class NavigateTo1672740245394 implements MigrationInterface {
    name = 'NavigateTo1672740245394';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_translation" ADD "navigateTo" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_translation" DROP COLUMN "navigateTo"`);
    }
}
