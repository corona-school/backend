import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPublicCourseRanking1594851852258 implements MigrationInterface {
    name = 'AddPublicCourseRanking1594851852258';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "publicRanking" integer NOT NULL DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "publicRanking"`, undefined);
    }

}
