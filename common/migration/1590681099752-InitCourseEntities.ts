import {MigrationInterface, QueryRunner} from "typeorm";

export class InitCourseEntities1590681099752 implements MigrationInterface {
    name = 'InitCourseEntities1590681099752';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "course_coursestate_enum" AS ENUM('created', 'submitted', 'allowed', 'denied', 'cancelled')`, undefined);
        await queryRunner.query(`CREATE TABLE "course" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "outline" character varying NOT NULL, "description" character varying NOT NULL, "motivation" character varying NOT NULL, "requirements" character varying NOT NULL, "imageUrl" character varying, "minGrade" integer NOT NULL, "maxGrade" integer NOT NULL, "categoryId" integer NOT NULL, "joinAfterStart" boolean NOT NULL, "startDate" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "frequency" integer NOT NULL, "courseState" "course_coursestate_enum" NOT NULL DEFAULT 'created', "instructorId" integer, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "isStudent" boolean NOT NULL DEFAULT true`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "isInstructor" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ADD "instructorDescription" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "verification" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "verifiedAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "authToken" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "authTokenSent" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "dissolveReason" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "verification" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "verifiedAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "authToken" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "authTokenSent" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "verification" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "verifiedAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "authToken" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "authTokenSent" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_32d94af473bb59d808d9a68e17b" FOREIGN KEY ("instructorId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_32d94af473bb59d808d9a68e17b"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "authTokenSent" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "authToken" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "verifiedAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "verification" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "authTokenSent" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "authToken" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "verifiedAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "screener" ALTER COLUMN "verification" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "match" ALTER COLUMN "dissolveReason" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "authTokenSent" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "authToken" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "verifiedAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "pupil" ALTER COLUMN "verification" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "instructorDescription"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isInstructor"`, undefined);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isStudent"`, undefined);
        await queryRunner.query(`DROP TABLE "course"`, undefined);
        await queryRunner.query(`DROP TYPE "course_coursestate_enum"`, undefined);
    }

}
