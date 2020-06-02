import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCertAndCourseLog1591092825596 implements MigrationInterface {
    name = 'AddCertAndCourseLog1591092825596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."log_logtype_enum" RENAME TO "log_logtype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "log_logtype_enum" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse', 'certificateRequest')`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum" USING "logtype"::"text"::"log_logtype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "log_logtype_enum_old" AS ENUM('misc', 'verificationRequets', 'verified', 'matchDissolve', 'fetchedFromWix', 'deActivate', 'updatePersonal', 'updateSubjects', 'accessedByScreener', 'updatedByScreener', 'updateStudentDescription', 'createdCourse')`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" TYPE "log_logtype_enum_old" USING "logtype"::"text"::"log_logtype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "logtype" SET DEFAULT 'misc'`, undefined);
        await queryRunner.query(`DROP TYPE "log_logtype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "log_logtype_enum_old" RENAME TO  "log_logtype_enum"`, undefined);
    }
}
