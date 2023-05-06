import { MigrationInterface, QueryRunner } from 'typeorm';

export class waitinglistQueueSortByDate1682007564086 implements MigrationInterface {
    name = 'waitinglistQueueSortByDate1682007564086';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "waiting_list_enrollment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "pupilId" integer, "subcourseId" integer, CONSTRAINT "PK_7c3bb40b03f8c4e1325ed4df416" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "waiting_list_enrollment" ADD CONSTRAINT "FK_c019519c21578e119799586d7ed" FOREIGN KEY ("pupilId") REFERENCES "pupil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "waiting_list_enrollment" ADD CONSTRAINT "FK_4c3bda70e61547bcdb61e85a110" FOREIGN KEY ("subcourseId") REFERENCES "subcourse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );

        const enrollments = await queryRunner.query('SELECT * FROM subcourse_waiting_list_pupil');
        console.log('[MIG]', `Found ${enrollments.length} people on waiting list`);
        for (const enrollment of enrollments) {
            console.log('[MIG]', `Creating waiting_list_enrollment for:", PupilID: ${enrollment.pupilId}, SubcourseID: ${enrollment.subcourseId}`);
            await queryRunner.query(`INSERT INTO "waiting_list_enrollment" ("pupilId", "subcourseId") VALUES ($1, $2)`, [
                enrollment.pupilId,
                enrollment.subcourseId,
            ]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waiting_list_enrollment" DROP CONSTRAINT "FK_4c3bda70e61547bcdb61e85a110"`);
        await queryRunner.query(`ALTER TABLE "waiting_list_enrollment" DROP CONSTRAINT "FK_c019519c21578e119799586d7ed"`);
        await queryRunner.query(`DROP TABLE "waiting_list_enrollment"`);
    }
}
