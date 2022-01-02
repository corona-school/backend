import {MigrationInterface, QueryRunner} from "typeorm";

export class CertificateOfConduct1640979167126 implements MigrationInterface {
    name = 'CertificateOfConduct1640979167126';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "remission_request" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uuid" character varying NOT NULL, "studentId" integer, CONSTRAINT "REL_5b96e9df53055059ad903ebc98" UNIQUE ("studentId"), CONSTRAINT "PK_4ea2cbe40d9d5cfe1d39a44558f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2ede2092e5c464510c99fcfd05" ON "remission_request" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "certificate_of_conduct" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dateOfInspection" TIMESTAMP NOT NULL, "dateOfIssue" TIMESTAMP NOT NULL, "criminalRecords" boolean NOT NULL, "studentId" integer, CONSTRAINT "REL_11ea2a4aad67ab6428a6ca21b4" UNIQUE ("studentId"), CONSTRAINT "PK_95058dd1916a7fb5ff77170c374" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "remission_request" ADD CONSTRAINT "FK_5b96e9df53055059ad903ebc98c" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificate_of_conduct" ADD CONSTRAINT "FK_11ea2a4aad67ab6428a6ca21b41" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_of_conduct" DROP CONSTRAINT "FK_11ea2a4aad67ab6428a6ca21b41"`);
        await queryRunner.query(`ALTER TABLE "remission_request" DROP CONSTRAINT "FK_5b96e9df53055059ad903ebc98c"`);
        await queryRunner.query(`DROP TABLE "certificate_of_conduct"`);
        await queryRunner.query(`DROP INDEX "IDX_2ede2092e5c464510c99fcfd05"`);
        await queryRunner.query(`DROP TABLE "remission_request"`);
    }

}
