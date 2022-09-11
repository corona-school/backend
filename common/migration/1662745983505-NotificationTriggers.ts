import {MigrationInterface, QueryRunner} from "typeorm";

export class NotificationTriggers1662745983505 implements MigrationInterface {
    name = 'NotificationTriggers1662745983505';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "hookID" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "hookID"`);
    }

}
