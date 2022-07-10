import {MigrationInterface, QueryRunner} from "typeorm";

export class NotificationSender1647788441823 implements MigrationInterface {
    name = 'NotificationSender1647788441823';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "notification_sender_enum" AS ENUM('SUPPORT', 'CERTIFICATE_OF_CONDUCT')`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "sender" "notification_sender_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "sender"`);
        await queryRunner.query(`DROP TYPE "notification_sender_enum"`);
    }

}
