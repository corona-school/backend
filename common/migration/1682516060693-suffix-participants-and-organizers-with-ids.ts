import {MigrationInterface, QueryRunner} from "typeorm";

export class suffixParticipantsAndOrganizersWithIds1682516060693 implements MigrationInterface {
    name = 'suffixParticipantsAndOrganizersWithIds1682516060693';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "organizers"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "participants"`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "organizerIds" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "participantIds" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "participantIds"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "organizerIds"`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "participants" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "organizers" text array NOT NULL DEFAULT '{}'`);
    }

}
