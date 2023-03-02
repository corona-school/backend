import { MigrationInterface, QueryRunner } from 'typeorm';

export class Appointment1675158151260 implements MigrationInterface {
    name = 'Appointment1675158151260';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointment_organizer_status_enum" AS ENUM('accepted', 'declined')`);
        await queryRunner.query(
            `CREATE TABLE "appointment_organizer" ("appointmentId" integer NOT NULL, "status" "public"."appointment_organizer_status_enum" NOT NULL DEFAULT 'accepted', "studentId" integer NOT NULL, CONSTRAINT "PK_c6be94a37c868a0f1d6dc1dbdcc" PRIMARY KEY ("appointmentId", "studentId"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_663993228113c003df5ab4325c" ON "appointment_organizer" ("status") `);
        await queryRunner.query(`CREATE TYPE "public"."appointment_participant_screener_status_enum" AS ENUM('accepted', 'declined')`);
        await queryRunner.query(
            `CREATE TABLE "appointment_participant_screener" ("appointmentId" integer NOT NULL, "status" "public"."appointment_participant_screener_status_enum" NOT NULL DEFAULT 'accepted', "screenerId" integer NOT NULL, CONSTRAINT "PK_e62bdfce2c0fd7def5be58fc83e" PRIMARY KEY ("appointmentId", "screenerId"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_228bb5330683338479bc19ed44" ON "appointment_participant_screener" ("status") `);
        await queryRunner.query(`CREATE TYPE "public"."appointment_participant_pupil_status_enum" AS ENUM('accepted', 'declined')`);
        await queryRunner.query(
            `CREATE TABLE "appointment_participant_pupil" ("appointmentId" integer NOT NULL, "status" "public"."appointment_participant_pupil_status_enum" NOT NULL DEFAULT 'accepted', "pupilId" integer NOT NULL, CONSTRAINT "PK_74833d50008d051feb2f7809786" PRIMARY KEY ("appointmentId", "pupilId"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_318b2ad16817f27bc091d1f564" ON "appointment_participant_pupil" ("status") `);
        await queryRunner.query(`CREATE TYPE "public"."appointment_participant_student_status_enum" AS ENUM('accepted', 'declined')`);
        await queryRunner.query(
            `CREATE TABLE "appointment_participant_student" ("appointmentId" integer NOT NULL, "status" "public"."appointment_participant_student_status_enum" NOT NULL DEFAULT 'accepted', "studentId" integer NOT NULL, CONSTRAINT "PK_8441a1bce3bcee8b6e7a81cbafc" PRIMARY KEY ("appointmentId", "studentId"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_6bbb7bec336dee923853580700" ON "appointment_participant_student" ("status") `);
        await queryRunner.query(`DROP INDEX "public"."IDX_663993228113c003df5ab4325c"`);
        await queryRunner.query(`ALTER TABLE "appointment_organizer" DROP COLUMN "status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_318b2ad16817f27bc091d1f564"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_pupil" DROP COLUMN "status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bbb7bec336dee923853580700"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_student" DROP COLUMN "status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_228bb5330683338479bc19ed44"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_screener" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_organizer_status_enum" AS ENUM('accepted', 'declined')`);
        await queryRunner.query(`ALTER TABLE "appointment_organizer" ADD "status" "public"."appointment_organizer_status_enum" NOT NULL DEFAULT 'accepted'`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_participant_screener_status_enum" AS ENUM('accepted', 'declined')`);
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_screener" ADD "status" "public"."appointment_participant_screener_status_enum" NOT NULL DEFAULT 'accepted'`
        );
        await queryRunner.query(`CREATE TYPE "public"."appointment_participant_pupil_status_enum" AS ENUM('accepted', 'declined')`);
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_pupil" ADD "status" "public"."appointment_participant_pupil_status_enum" NOT NULL DEFAULT 'accepted'`
        );
        await queryRunner.query(`CREATE TYPE "public"."appointment_participant_student_status_enum" AS ENUM('accepted', 'declined')`);
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_student" ADD "status" "public"."appointment_participant_student_status_enum" NOT NULL DEFAULT 'accepted'`
        );
        await queryRunner.query(`ALTER TABLE "lecture" ADD "title" text`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "description" text`);
        await queryRunner.query(`CREATE TYPE "public"."lecture_appointmenttype_enum" AS ENUM('group', '1on1', 'other-internal', 'legacy-lecture')`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "appointmentType" "public"."lecture_appointmenttype_enum" NOT NULL DEFAULT 'legacy-lecture'`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "meetingLink" character varying`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "isCanceled" boolean`);
        await queryRunner.query(`ALTER TABLE "lecture" ADD "matchId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_663993228113c003df5ab4325c" ON "appointment_organizer" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_228bb5330683338479bc19ed44" ON "appointment_participant_screener" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_318b2ad16817f27bc091d1f564" ON "appointment_participant_pupil" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_6bbb7bec336dee923853580700" ON "appointment_participant_student" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_94585a075d9c53d290e05dff58" ON "appointment_organizer" ("appointmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3c35166da05f2d01b0f7a35622" ON "appointment_organizer" ("studentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_78d1b067a6141aad3e57b22923" ON "appointment_participant_pupil" ("appointmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_896b4d484fef3fd34d2478ecb6" ON "appointment_participant_pupil" ("pupilId") `);
        await queryRunner.query(`CREATE INDEX "IDX_277d879a84f17a51285a9cb23a" ON "appointment_participant_student" ("appointmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d3bbcc2d0b1a2df8fe1474f4d" ON "appointment_participant_student" ("studentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_17f70e66854b86f480dd767bcc" ON "appointment_participant_screener" ("appointmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a8d1879d93a2c114d14fb9bad" ON "appointment_participant_screener" ("screenerId") `);
        await queryRunner.query(
            `ALTER TABLE "lecture" ADD CONSTRAINT "FK_5829da504d003d9aa252856574e" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "appointment_organizer" ADD CONSTRAINT "FK_94585a075d9c53d290e05dff587" FOREIGN KEY ("appointmentId") REFERENCES "lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "appointment_organizer" ADD CONSTRAINT "FK_3c35166da05f2d01b0f7a356223" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_pupil" ADD CONSTRAINT "FK_78d1b067a6141aad3e57b229236" FOREIGN KEY ("appointmentId") REFERENCES "lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_pupil" ADD CONSTRAINT "FK_896b4d484fef3fd34d2478ecb64" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_student" ADD CONSTRAINT "FK_277d879a84f17a51285a9cb23a9" FOREIGN KEY ("appointmentId") REFERENCES "lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_student" ADD CONSTRAINT "FK_4d3bbcc2d0b1a2df8fe1474f4dd" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_screener" ADD CONSTRAINT "FK_17f70e66854b86f480dd767bcce" FOREIGN KEY ("appointmentId") REFERENCES "lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_screener" ADD CONSTRAINT "FK_0a8d1879d93a2c114d14fb9bade" FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_participant_screener" DROP CONSTRAINT "FK_0a8d1879d93a2c114d14fb9bade"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_screener" DROP CONSTRAINT "FK_17f70e66854b86f480dd767bcce"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_student" DROP CONSTRAINT "FK_4d3bbcc2d0b1a2df8fe1474f4dd"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_student" DROP CONSTRAINT "FK_277d879a84f17a51285a9cb23a9"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_pupil" DROP CONSTRAINT "FK_896b4d484fef3fd34d2478ecb64"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_pupil" DROP CONSTRAINT "FK_78d1b067a6141aad3e57b229236"`);
        await queryRunner.query(`ALTER TABLE "appointment_organizer" DROP CONSTRAINT "FK_3c35166da05f2d01b0f7a356223"`);
        await queryRunner.query(`ALTER TABLE "appointment_organizer" DROP CONSTRAINT "FK_94585a075d9c53d290e05dff587"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP CONSTRAINT "FK_5829da504d003d9aa252856574e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a8d1879d93a2c114d14fb9bad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17f70e66854b86f480dd767bcc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d3bbcc2d0b1a2df8fe1474f4d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_277d879a84f17a51285a9cb23a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_896b4d484fef3fd34d2478ecb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78d1b067a6141aad3e57b22923"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c35166da05f2d01b0f7a35622"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94585a075d9c53d290e05dff58"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bbb7bec336dee923853580700"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_318b2ad16817f27bc091d1f564"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_228bb5330683338479bc19ed44"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_663993228113c003df5ab4325c"`);
        await queryRunner.query(`ALTER TABLE "mentor" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "lastTimeCheckedNotifications" SET DEFAULT '1970-01-01 00:00:00'`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "matchId"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "isCanceled"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "meetingLink"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "appointmentType"`);
        await queryRunner.query(`DROP TYPE "public"."lecture_appointmenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "lecture" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_student" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_participant_student_status_enum"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_pupil" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_participant_pupil_status_enum"`);
        await queryRunner.query(`ALTER TABLE "appointment_participant_screener" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_participant_screener_status_enum"`);
        await queryRunner.query(`ALTER TABLE "appointment_organizer" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_organizer_status_enum"`);
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_screener" ADD "status" "public"."appointment_participant_screener_status_enum" NOT NULL DEFAULT 'accepted'`
        );
        await queryRunner.query(`CREATE INDEX "IDX_228bb5330683338479bc19ed44" ON "appointment_participant_screener" ("status") `);
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_student" ADD "status" "public"."appointment_participant_student_status_enum" NOT NULL DEFAULT 'accepted'`
        );
        await queryRunner.query(`CREATE INDEX "IDX_6bbb7bec336dee923853580700" ON "appointment_participant_student" ("status") `);
        await queryRunner.query(
            `ALTER TABLE "appointment_participant_pupil" ADD "status" "public"."appointment_participant_pupil_status_enum" NOT NULL DEFAULT 'accepted'`
        );
        await queryRunner.query(`CREATE INDEX "IDX_318b2ad16817f27bc091d1f564" ON "appointment_participant_pupil" ("status") `);
        await queryRunner.query(`ALTER TABLE "appointment_organizer" ADD "status" "public"."appointment_organizer_status_enum" NOT NULL DEFAULT 'accepted'`);
        await queryRunner.query(`CREATE INDEX "IDX_663993228113c003df5ab4325c" ON "appointment_organizer" ("status") `);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bbb7bec336dee923853580700"`);
        await queryRunner.query(`DROP TABLE "appointment_participant_student"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_participant_student_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_318b2ad16817f27bc091d1f564"`);
        await queryRunner.query(`DROP TABLE "appointment_participant_pupil"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_participant_pupil_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_228bb5330683338479bc19ed44"`);
        await queryRunner.query(`DROP TABLE "appointment_participant_screener"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_participant_screener_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_663993228113c003df5ab4325c"`);
        await queryRunner.query(`DROP TABLE "appointment_organizer"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_organizer_status_enum"`);
    }
}
