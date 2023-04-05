import {MigrationInterface, QueryRunner} from "typeorm";

export class pupilscreening1678039222742 implements MigrationInterface {
    name = 'pupilscreening1678039222742';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pupil_screening_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "pupil_screening" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."pupil_screening_status_enum" NOT NULL DEFAULT '0', "invalidated" boolean NOT NULL, "comment" character varying, "pupilId" integer, CONSTRAINT "PK_3b4bba5fc1846edc712915c9dfa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pupil_screening" ADD CONSTRAINT "FK_d53a566dbe1a58b06bea8b51c1d" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil_screening" DROP CONSTRAINT "FK_d53a566dbe1a58b06bea8b51c1d"`);
        await queryRunner.query(`DROP TABLE "pupil_screening"`);
        await queryRunner.query(`DROP TYPE "public"."pupil_screening_status_enum"`);
    }

}
