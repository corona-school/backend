import {MigrationInterface, QueryRunner} from "typeorm";

export class ManyInterestConfirmations1665681148750 implements MigrationInterface {
    name = 'ManyInterestConfirmations1665681148750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" DROP CONSTRAINT "FK_5928ac6454eee0bfbdb8e538ef8"`);
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" DROP CONSTRAINT "REL_5928ac6454eee0bfbdb8e538ef"`);
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" ADD CONSTRAINT "FK_5928ac6454eee0bfbdb8e538ef8" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" DROP CONSTRAINT "FK_5928ac6454eee0bfbdb8e538ef8"`);
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" ADD CONSTRAINT "REL_5928ac6454eee0bfbdb8e538ef" UNIQUE ("pupilId")`);
        await queryRunner.query(`ALTER TABLE "pupil_tutoring_interest_confirmation_request" ADD CONSTRAINT "FK_5928ac6454eee0bfbdb8e538ef8" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
