import {MigrationInterface, QueryRunner} from "typeorm";

export class MatchRequestTimes1657462370831 implements MigrationInterface {
    name = 'MatchRequestTimes1657462370831';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" ADD "firstMatchRequest" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "match" ADD "studentFirstMatchRequest" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "match" ADD "pupilFirstMatchRequest" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "student" ADD "firstMatchRequest" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "firstMatchRequest"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "pupilFirstMatchRequest"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "studentFirstMatchRequest"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "firstMatchRequest"`);
    }

}
