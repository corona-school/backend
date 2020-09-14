import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMentor1599052171950 implements MigrationInterface {
    name = 'AddMentor1599052171950';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "mentor_division_enum" AS ENUM('facebook', 'email', 'events', 'video', 'supervision')`, undefined);
        await queryRunner.query(`CREATE TYPE "mentor_expertise_enum" AS ENUM('language difficulties and communication', 'specialized expertise in subjects', 'educational and didactic expertise', 'technical support', 'self-organization')`, undefined);
        await queryRunner.query(`CREATE TABLE "mentor" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstname" character varying, "lastname" character varying, "active" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "verification" character varying DEFAULT null, "verifiedAt" TIMESTAMP DEFAULT null, "authToken" character varying DEFAULT null, "authTokenUsed" boolean NOT NULL DEFAULT false, "authTokenSent" TIMESTAMP DEFAULT null, "division" "mentor_division_enum" array NOT NULL, "expertise" "mentor_expertise_enum" array NOT NULL, "subjects" character varying, "teachingExperience" boolean, "message" character varying, "description" character varying, "imageUrl" character varying, CONSTRAINT "PK_9fcebd0a40237e9b6defcbd9d74" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e03cfa18e81812d44f5cdf9479" ON "mentor" ("email") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_704a7bf0ca9889bd5c4ea1a15b" ON "mentor" ("verification") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d6c74ee02bc266daf510d3ef2a" ON "mentor" ("authToken") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_d6c74ee02bc266daf510d3ef2a"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_704a7bf0ca9889bd5c4ea1a15b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e03cfa18e81812d44f5cdf9479"`, undefined);
        await queryRunner.query(`DROP TABLE "mentor"`, undefined);
        await queryRunner.query(`DROP TYPE "mentor_expertise_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "mentor_division_enum"`, undefined);
    }
}
