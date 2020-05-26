import { MigrationInterface, QueryRunner } from "typeorm";

export class backendv21588805753174 implements MigrationInterface {
    name = "backendv21588805753174";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener')`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "log" ("id" SERIAL NOT NULL, "logtype" "log_logtype_enum" NOT NULL DEFAULT 'misc', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "user" character varying NOT NULL, "data" character varying NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" ADD "authTokenUsed" boolean NOT NULL DEFAULT false`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" ADD "authTokenSent" TIMESTAMP DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ADD "authTokenUsed" boolean NOT NULL DEFAULT false`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ADD "authTokenSent" TIMESTAMP DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ADD "authTokenUsed" boolean NOT NULL DEFAULT false`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ADD "authTokenSent" TIMESTAMP DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ADD "openMatchRequestCount" integer NOT NULL DEFAULT 1`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "match" ADD "dissolveReason" integer DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" ALTER COLUMN "verification" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" ALTER COLUMN "verifiedAt" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" ALTER COLUMN "authToken" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ALTER COLUMN "verification" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ALTER COLUMN "verifiedAt" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ALTER COLUMN "authToken" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ALTER COLUMN "moreMatchRequests" SET DEFAULT 1`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ALTER COLUMN "verification" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ALTER COLUMN "verifiedAt" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ALTER COLUMN "authToken" SET DEFAULT null`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" RENAME COLUMN "moreMatchRequests" TO "openMatchRequestCount"`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student" RENAME COLUMN "openMatchRequestCount" TO "moreMatchRequests"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ALTER COLUMN "authToken" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ALTER COLUMN "verifiedAt" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" ALTER COLUMN "verification" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ALTER COLUMN "moreMatchRequests" SET DEFAULT 0`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ALTER COLUMN "authToken" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ALTER COLUMN "verifiedAt" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" ALTER COLUMN "verification" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" ALTER COLUMN "authToken" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" ALTER COLUMN "verifiedAt" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" ALTER COLUMN "verification" DROP DEFAULT`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "match" DROP COLUMN "dissolveReason"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" DROP COLUMN "openMatchRequestCount"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" DROP COLUMN "authTokenSent"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "pupil" DROP COLUMN "authTokenUsed"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" DROP COLUMN "authTokenSent"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "student" DROP COLUMN "authTokenUsed"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" DROP COLUMN "authTokenSent"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "screener" DROP COLUMN "authTokenUsed"`,
            undefined
        );
        await queryRunner.query(`DROP TABLE "log"`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum"`, undefined);
    }
}
