import {MigrationInterface, QueryRunner} from "typeorm";

export class AppointmentsData1682414667095 implements MigrationInterface {
    name = 'AppointmentsData1682414667095';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" ADD "title" text`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "description" text`);
        await queryRunner.query(`CREATE TYPE "public"."lecture_appointmenttype_enum" AS ENUM('group', 'match', 'internal', 'legacy')`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "appointmentType" "public"."lecture_appointmenttype_enum" NOT NULL DEFAULT 'legacy'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "isCanceled" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "organizers" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "participants" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "declinedBy" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "matchId" integer`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "mentor" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '"1970-01-01T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD CONSTRAINT "FK_5829da504d003d9aa252856574e" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lecture" DROP CONSTRAINT "FK_5829da504d003d9aa252856574e"`);
        await queryRunner.query(`ALTER TABLE "mentor" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "matchId"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "declinedBy"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "participants"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "organizers"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "isCanceled"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "appointmentType"`);
        await queryRunner.query(`DROP TYPE "public"."lecture_appointmenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "title"`);
    }

}
