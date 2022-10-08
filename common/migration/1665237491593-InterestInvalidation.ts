import {MigrationInterface, QueryRunner} from "typeorm";

export class InterestInvalidation1665237491593 implements MigrationInterface {
    name = 'InterestInvalidation1665237491593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" ADD "invalidated" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" DROP COLUMN "invalidated"`);
    }

}
