import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseScreening1592662298460 implements MigrationInterface {
    name = 'CourseScreening1592662298460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "screeningComment" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "screeningComment"`, undefined);
    }

}
