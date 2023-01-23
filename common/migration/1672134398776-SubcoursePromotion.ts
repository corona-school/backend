import {MigrationInterface, QueryRunner} from "typeorm";

export class SubcoursePromotion1672134398776 implements MigrationInterface {
    name = 'SubcoursePromotion1672134398776';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" ADD "publishedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subcourse" ADD "alreadyPromoted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcourse" DROP COLUMN "alreadyPromoted"`);
        await queryRunner.query(`ALTER TABLE "subcourse" DROP COLUMN "publishedAt"`);
    }

}
