import {MigrationInterface, QueryRunner} from "typeorm";

export class Secrets1653577788516 implements MigrationInterface {
    name = 'Secrets1653577788516';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "secret_type_enum" AS ENUM('PASSWORD', 'TOKEN', 'EMAIL_TOKEN')`);
        await queryRunner.query(`CREATE TABLE "secret" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "type" "secret_type_enum" NOT NULL, "secret" character varying NOT NULL, "expiresAt" TIMESTAMP, "lastUsed" TIMESTAMP, CONSTRAINT "PK_6afa4961954e17ec2d6401afc3d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "secret"`);
        await queryRunner.query(`DROP TYPE "secret_type_enum"`);
    }

}
