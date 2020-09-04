import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMentor1599052171950 implements MigrationInterface {
    name = 'AddMentor1599052171950';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "mentor_division_enum" AS ENUM ('facebook', 'email', 'events', 'video', 'supervision')`, undefined);
        await queryRunner.query(`CREATE TYPE "mentor_expertise_enum" AS ENUM ('language difficulties and communication', 'specialized expertise in subjects', 'educational and didactic expertise', 'technical support', 'self-organization')`, undefined);
        await queryRunner.query(`CREATE TABLE "mentor" (
                                "id" SERIAL NOT NULL,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                                "firstname" character varying,
                                "lastname" character varying,
                                "active" boolean DEFAULT true,
                                "email" character varying,
                                "verification" character varying,
                                "verifiedAt" TIMESTAMP,
                                "authToken" character varying,
                                "authTokenUsed" boolean NOT NULL DEFAULT false,
                                "authTokenSent" TIMESTAMP,
                                "division" mentor_division_enum[] NOT NULL,
                                "expertise" mentor_expertise_enum[] NOT NULL,
                                "subjects" character varying,
                                "teachingExperience" boolean,
                                "message" character varying,
                                "description" character varying,
                                "imageUrl" character varying,
                                UNIQUE ("email", "verification", "authToken"),
                                CONSTRAINT "PK_9fcebd0a40237e9b6defcbd9d74" PRIMARY KEY ("id")
                                )`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "mentor"`, undefined)
        await queryRunner.query(`DROP TYPE "mentor_expertise_enum"`, undefined)
        await queryRunner.query(`DROP TYPE "mentor_division_enum"`, undefined)
    }
}
