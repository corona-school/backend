import { MigrationInterface, QueryRunner } from 'typeorm';

export class addImportantNotifications1677330878850 implements MigrationInterface {
    name = 'addImportantNotifications1677330878850';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."important_information_recipients_enum" AS ENUM('students', 'pupils')`);
        await queryRunner.query(`CREATE TYPE "public"."important_information_language_enum" AS ENUM('en', 'de')`);
        await queryRunner.query(
            `CREATE TABLE "important_information" ("id" SERIAL NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "recipients" "public"."important_information_recipients_enum" NOT NULL, "navigateTo" text, "language" "public"."important_information_language_enum" NOT NULL DEFAULT 'de', CONSTRAINT "PK_bcd2068ca02cc6f323bf01754a5" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "important_information"`);
        await queryRunner.query(`DROP TYPE "public"."important_information_language_enum"`);
        await queryRunner.query(`DROP TYPE "public"."important_information_recipients_enum"`);
    }
}
