import {MigrationInterface, QueryRunner} from "typeorm";

export class ConcreteNotification1625084085470 implements MigrationInterface {
    name = 'ConcreteNotification1625084085470';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concrete_notification" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "notificationID" integer NOT NULL, "contextID" character varying, "context" json NOT NULL, "sentAt" TIMESTAMP NOT NULL, "state" integer NOT NULL, "error" character varying, CONSTRAINT "PK_830b05c48e7ba274a9e4bceced3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "concrete_notification"`);
    }

}
