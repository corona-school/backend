import {MigrationInterface, QueryRunner} from "typeorm";

export class Secrets1645725221253 implements MigrationInterface {
    name = 'Secrets1645725221253';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "secret" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "type" integer NOT NULL, "secret" character varying NOT NULL, "expiresAt" TIMESTAMP, "lastUsed" TIMESTAMP, CONSTRAINT "PK_6afa4961954e17ec2d6401afc3d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "secret"`);
    }

}
