import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseMaxParticip1590699796907 implements MigrationInterface {
    name = 'CourseMaxParticip1590699796907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "maxParticipants" integer NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "maxParticipants"`, undefined);
    }

}
