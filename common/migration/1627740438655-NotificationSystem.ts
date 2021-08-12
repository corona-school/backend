import {MigrationInterface, QueryRunner} from "typeorm";

export class NotificationSystem1627740438655 implements MigrationInterface {
    name = 'NotificationSystem1627740438655';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concrete_notification" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "notificationID" integer NOT NULL, "contextID" character varying, "context" json NOT NULL, "sentAt" TIMESTAMP NOT NULL, "state" integer NOT NULL, "error" character varying, CONSTRAINT "PK_830b05c48e7ba274a9e4bceced3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "mailjetTemplateId" integer, "description" character varying NOT NULL, "active" boolean NOT NULL, "recipient" integer NOT NULL, "onActions" text array NOT NULL, "category" text array NOT NULL, "cancelledOnAction" text array NOT NULL, "delay" integer, "interval" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "concrete_notification"`);
    }

}
