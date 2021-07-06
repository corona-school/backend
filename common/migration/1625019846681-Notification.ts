import {MigrationInterface, QueryRunner} from "typeorm";

export class Notification1625019846681 implements MigrationInterface {
    name = 'Notification1625019846681';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" integer NOT NULL, "description" character varying NOT NULL, "active" boolean NOT NULL, "recipient" integer NOT NULL, "onActions" text array NOT NULL, "category" text array NOT NULL, "cancelledOnAction" text array NOT NULL, "delay" integer, "interval" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
