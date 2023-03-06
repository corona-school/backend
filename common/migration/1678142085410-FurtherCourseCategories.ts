import {MigrationInterface, QueryRunner} from "typeorm";

export class FurtherCourseCategories1678142085410 implements MigrationInterface {
    name = 'FurtherCourseCategories1678142085410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."course_category_enum" RENAME TO "course_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."course_category_enum" AS ENUM('language', 'focus', 'revision', 'club', 'coaching')`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "category" TYPE "public"."course_category_enum" USING "category"::"text"::"public"."course_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."course_category_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."course_category_enum_old" AS ENUM('revision', 'club', 'coaching')`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "category" TYPE "public"."course_category_enum_old" USING "category"::"text"::"public"."course_category_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."course_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."course_category_enum_old" RENAME TO "course_category_enum"`);
    }

}
