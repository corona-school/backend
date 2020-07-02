import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseScreening1592662298460 implements MigrationInterface {
    name = 'CourseScreening1592662298460';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "screeningComment" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE subcourse ADD COLUMN "courseId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE subcourse ADD CONSTRAINT "FK_274b57f6af62ffadb80afcbae85" FOREIGN KEY ("courseId") REFERENCES course(id)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE subcourse DROP CONSTRAINT "FK_274b57f6af62ffadb80afcbae85"`, undefined);
        await queryRunner.query(`ALTER TABLE subcourse DROP COLUMN "courseId"`, undefined);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "screeningComment"`, undefined);
    }
}
