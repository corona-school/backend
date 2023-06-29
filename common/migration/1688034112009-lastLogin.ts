import { MigrationInterface, QueryRunner } from 'typeorm';

export class lastLogin1688034112009 implements MigrationInterface {
    name = 'lastLogin1688034112009';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pupil" ADD "lastLogin" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "screener" ADD "lastLogin" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ADD "lastLogin" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "lastLogin" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "lastLogin"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "lastLogin"`);
        await queryRunner.query(`ALTER TABLE "screener" DROP COLUMN "lastLogin"`);
        await queryRunner.query(`ALTER TABLE "pupil" DROP COLUMN "lastLogin"`);
    }
}
