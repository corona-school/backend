import {MigrationInterface, QueryRunner} from "typeorm";

export class CoursesSprint31592161769334 implements MigrationInterface {
    name = 'CoursesSprint31592161769334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" ADD "joinAfterStart" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" DROP COLUMN "joinAfterStart"`, undefined);
    }

}
