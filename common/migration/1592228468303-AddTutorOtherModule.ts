import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTutorOtherModule1592228468303 implements MigrationInterface {
    name = 'AddTutorOtherModule1592228468303';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."student_module_enum" RENAME TO "student_module_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "student_module_enum" AS ENUM('internship', 'seminar', 'other')`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "module" TYPE "student_module_enum" USING "module"::"text"::"student_module_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "student_module_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "lastSentScreeningInvitationDate" DROP DEFAULT`, undefined);
        await queryRunner.query(`CREATE TYPE "student_module_enum_old" AS ENUM('internship', 'seminar')`, undefined);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "module" TYPE "student_module_enum_old" USING "module"::"text"::"student_module_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "student_module_enum"`, undefined);
    }

}
