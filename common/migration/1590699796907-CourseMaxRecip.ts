import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseMaxRecip1590699796907 implements MigrationInterface {
    name = 'CourseMaxRecip1590699796907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "maxRecipients" integer NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "maxRecipients"`, undefined);
    }

}
