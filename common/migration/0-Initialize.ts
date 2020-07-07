import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize0 implements MigrationInterface {
    name = 'Initialize0';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "log" ("id" SERIAL NOT NULL, "logtype" "log_logtype_enum" NOT NULL DEFAULT 'misc', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "user" character varying NOT NULL, "data" character varying NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "mail_mailtype_enum" AS ENUM('dissolved', 'matched', 'verification', 'logintoken', 'other')`, undefined);
        await queryRunner.query(`CREATE TABLE "mail" ("id" SERIAL NOT NULL, "mailtype" "mail_mailtype_enum" NOT NULL DEFAULT 'other', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sendTimestamp" TIMESTAMP NOT NULL, "sender" character varying NOT NULL, "subject" character varying NOT NULL, "html" character varying NOT NULL, "text" character varying NOT NULL, "receiver" character varying NOT NULL, CONSTRAINT "PK_5407da42b983ba54c6c62d462d3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "screener" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstname" character varying, "lastname" character varying, "active" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "verification" character varying DEFAULT null, "verifiedAt" TIMESTAMP DEFAULT null, "authToken" character varying DEFAULT null, "authTokenUsed" boolean NOT NULL DEFAULT false, "authTokenSent" TIMESTAMP DEFAULT null, "password" character varying NOT NULL, "verified" boolean DEFAULT false, "oldNumberID" integer, CONSTRAINT "UQ_96dc11de485d62615e78a875293" UNIQUE ("oldNumberID"), CONSTRAINT "PK_3a023b02ed01df4a6956af1ea94" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_29a6207bc70a2b9e6731d66bcf" ON "screener" ("email") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c9e25ecca022d0d6cd401d9e5e" ON "screener" ("verification") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b858e5a35c51a4dbf6922025e7" ON "screener" ("authToken") `, undefined);
        await queryRunner.query(`CREATE TABLE "screening" ("id" SERIAL NOT NULL, "success" boolean NOT NULL, "comment" character varying, "knowsCoronaSchoolFrom" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "screenerId" integer, "studentId" integer, CONSTRAINT "REL_dfb78fd7887c69e3c52e002083" UNIQUE ("studentId"), CONSTRAINT "PK_5111bc526c9133721aeffb9a578" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstname" character varying, "lastname" character varying, "active" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "verification" character varying DEFAULT null, "verifiedAt" TIMESTAMP DEFAULT null, "authToken" character varying DEFAULT null, "authTokenUsed" boolean NOT NULL DEFAULT false, "authTokenSent" TIMESTAMP DEFAULT null, "wix_id" character varying NOT NULL, "wix_creation_date" TIMESTAMP NOT NULL, "birthday" date, "subjects" character varying NOT NULL, "msg" character varying, "phone" character varying, "openMatchRequestCount" integer NOT NULL DEFAULT 1, "feedback" character varying, CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a56c051c91dbe1068ad683f536" ON "student" ("email") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_34cbafcb0bcdfb2b6de9010acb" ON "student" ("verification") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f4d0994b549167f69e3cec7c00" ON "student" ("authToken") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_545d0c66310ca5df98b4765cc7" ON "student" ("wix_id") `, undefined);
        await queryRunner.query(`CREATE TABLE "pupil" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstname" character varying, "lastname" character varying, "active" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "verification" character varying DEFAULT null, "verifiedAt" TIMESTAMP DEFAULT null, "authToken" character varying DEFAULT null, "authTokenUsed" boolean NOT NULL DEFAULT false, "authTokenSent" TIMESTAMP DEFAULT null, "wix_id" character varying NOT NULL, "wix_creation_date" TIMESTAMP NOT NULL, "subjects" character varying NOT NULL, "state" character varying, "msg" character varying, "grade" character varying, "openMatchRequestCount" integer NOT NULL DEFAULT 1, CONSTRAINT "PK_34f2dbae733affb8884c2255c21" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_24d523169870b7e80f9e68aad3" ON "pupil" ("email") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_90fde657ec008e61a5b07947b3" ON "pupil" ("verification") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5ff14bcaf5fdce75691fa8f34a" ON "pupil" ("authToken") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_16c46adbb2885e591364e476e5" ON "pupil" ("wix_id") `, undefined);
        await queryRunner.query(`CREATE TABLE "match" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "dissolved" boolean NOT NULL DEFAULT false, "dissolveReason" integer DEFAULT null, "proposedTime" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "automaticMailsForConfirmationDisabled" boolean NOT NULL DEFAULT false, "automaticMailsForDissolutionDisabled" boolean NOT NULL DEFAULT false, "automaticMailsForFeedbackDisabled" boolean NOT NULL DEFAULT false, "source" "match_source_enum" NOT NULL DEFAULT 'matchedinternal', "studentId" integer, "pupilId" integer, "confirmationToStudentMailId" integer, "confirmationToPupilMailId" integer, "dissolutionToStudentMailId" integer, "dissolutionToPupilMailId" integer, "feedbackToPupilMailId" integer, "feedbackToStudentMailId" integer, CONSTRAINT "UQ_MATCH" UNIQUE ("studentId", "pupilId"), CONSTRAINT "REL_3d73a8a5c5e8a120b63df389b6" UNIQUE ("confirmationToStudentMailId"), CONSTRAINT "REL_fef5c21e7977af1f5fdf2153e0" UNIQUE ("confirmationToPupilMailId"), CONSTRAINT "REL_72eb9ce4ff7e5e1a2d668bb267" UNIQUE ("dissolutionToStudentMailId"), CONSTRAINT "REL_24e84ce75ede0251f5c4f30e73" UNIQUE ("dissolutionToPupilMailId"), CONSTRAINT "REL_7e8326dd14aab100e88912c9d2" UNIQUE ("feedbackToPupilMailId"), CONSTRAINT "REL_a547b949511093852667f04b6e" UNIQUE ("feedbackToStudentMailId"), CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_65a3ec8c0aa6c3c9c04f5b53e3" ON "match" ("uuid") `, undefined);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_c0b20c6342ac95d3b66c31ac30e" FOREIGN KEY ("screenerId") REFERENCES "screener"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_dfb78fd7887c69e3c52e0020838" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_89d8d61ff2bcae46513788416e4" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_38770d911dab69557a913812f3f" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_3d73a8a5c5e8a120b63df389b64" FOREIGN KEY ("confirmationToStudentMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_fef5c21e7977af1f5fdf2153e0f" FOREIGN KEY ("confirmationToPupilMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_72eb9ce4ff7e5e1a2d668bb2671" FOREIGN KEY ("dissolutionToStudentMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_24e84ce75ede0251f5c4f30e737" FOREIGN KEY ("dissolutionToPupilMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_7e8326dd14aab100e88912c9d2b" FOREIGN KEY ("feedbackToPupilMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_a547b949511093852667f04b6e5" FOREIGN KEY ("feedbackToStudentMailId") REFERENCES "mail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_a547b949511093852667f04b6e5"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_7e8326dd14aab100e88912c9d2b"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_24e84ce75ede0251f5c4f30e737"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_72eb9ce4ff7e5e1a2d668bb2671"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_fef5c21e7977af1f5fdf2153e0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_3d73a8a5c5e8a120b63df389b64"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_38770d911dab69557a913812f3f"`, undefined);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_89d8d61ff2bcae46513788416e4"`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_dfb78fd7887c69e3c52e0020838"`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_c0b20c6342ac95d3b66c31ac30e"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_65a3ec8c0aa6c3c9c04f5b53e3"`, undefined);
        await queryRunner.query(`DROP TABLE "match"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_16c46adbb2885e591364e476e5"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5ff14bcaf5fdce75691fa8f34a"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_90fde657ec008e61a5b07947b3"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_24d523169870b7e80f9e68aad3"`, undefined);
        await queryRunner.query(`DROP TABLE "pupil"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_545d0c66310ca5df98b4765cc7"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f4d0994b549167f69e3cec7c00"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_34cbafcb0bcdfb2b6de9010acb"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a56c051c91dbe1068ad683f536"`, undefined);
        await queryRunner.query(`DROP TABLE "student"`, undefined);
        await queryRunner.query(`DROP TABLE "screening"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_b858e5a35c51a4dbf6922025e7"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_c9e25ecca022d0d6cd401d9e5e"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_29a6207bc70a2b9e6731d66bcf"`, undefined);
        await queryRunner.query(`DROP TABLE "screener"`, undefined);
        await queryRunner.query(`DROP TABLE "mail"`, undefined);
        await queryRunner.query(`DROP TYPE "mail_mailtype_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "log"`, undefined);
    }

}
