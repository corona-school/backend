import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLastUpdatedSettingsViaBlockerDate1598905268625 implements MigrationInterface {
    name = 'AddLastUpdatedSettingsViaBlockerDate1598905268625';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" ADD "lastUpdatedSettingsViaBlocker" TIMESTAMP DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "lastUpdatedSettingsViaBlocker" TIMESTAMP DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "lastUpdatedSettingsViaBlocker"`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "lastUpdatedSettingsViaBlocker"`, undefined);
    }

}
