import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCertificateOfConduct1636569709904 implements MigrationInterface {
    name = 'AddCertificateOfConduct1636569709904';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "certificate_of_conduct" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dateOfInspection" TIMESTAMP NOT NULL, "dateOfIssue" TIMESTAMP NOT NULL, "criminalRecords" boolean NOT NULL, "studentId" integer, CONSTRAINT "REL_11ea2a4aad67ab6428a6ca21b4" UNIQUE ("studentId"), CONSTRAINT "PK_95058dd1916a7fb5ff77170c374" PRIMARY KEY ("id"))`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
