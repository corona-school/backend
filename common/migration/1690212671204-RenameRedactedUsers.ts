import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRedactedUsers1690212671204 implements MigrationInterface {
    name = 'RenameRedactedUsers1690212671204';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "pupil" SET firstname = 'Account', lastname = 'gelöscht' WHERE firstname = 'REDACTED' AND lastname = 'REDACTED'`);
        await queryRunner.query(`UPDATE "student" SET firstname = 'Account', lastname = 'gelöscht' WHERE firstname = 'REDACTED' AND lastname = 'REDACTED'`);
        await queryRunner.query(`UPDATE "mentor" SET firstname = 'Account', lastname = 'gelöscht' WHERE firstname = 'REDACTED' AND lastname = 'REDACTED'`);
        await queryRunner.query(`UPDATE "screener" SET firstname = 'Account', lastname = 'gelöscht' WHERE firstname = 'REDACTED' AND lastname = 'REDACTED'`);
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {}
}
