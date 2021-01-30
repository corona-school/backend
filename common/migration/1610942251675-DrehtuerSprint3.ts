import {MigrationInterface, QueryRunner} from "typeorm";

export class DrehtuerSprint31610942251675 implements MigrationInterface {
    name = 'DrehtuerSprint31610942251675';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_guest" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "courseId" integer, "inviterId" integer, CONSTRAINT "PK_f12462c16c543cf76ed1fa49289" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8fb7b15823c3ed0fea3c508ac4" ON "course_guest" ("token") `);
        await queryRunner.query(`ALTER TABLE "course_guest" ADD CONSTRAINT "FK_4392726b6462358a809db822af4" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_guest" ADD CONSTRAINT "FK_a0843258a46daa7d91dc2cef917" FOREIGN KEY ("inviterId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_guest" DROP CONSTRAINT "FK_a0843258a46daa7d91dc2cef917"`);
        await queryRunner.query(`ALTER TABLE "course_guest" DROP CONSTRAINT "FK_4392726b6462358a809db822af4"`);
        await queryRunner.query(`DROP INDEX "IDX_8fb7b15823c3ed0fea3c508ac4"`);
        await queryRunner.query(`DROP TABLE "course_guest"`);
    }

}
