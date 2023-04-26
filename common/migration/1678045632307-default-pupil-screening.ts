import {MigrationInterface, QueryRunner} from "typeorm";

export class defaultPupilScreening1678045632307 implements MigrationInterface {
    name = 'defaultPupilScreening1678045632307';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil_screening" ALTER COLUMN "invalidated" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil_screening" ALTER COLUMN "invalidated" DROP DEFAULT`);
    }

}
