import { prisma } from '../common/prisma';
import { sendToSlack, SLACK_CHANNEL } from '../common/slack';
import { table } from '../common/slack/blocks';

export async function postStatisticsToSlack() {
    const lastMonthBegin = new Date();
    lastMonthBegin.setMonth(lastMonthBegin.getMonth() - 1);
    lastMonthBegin.setUTCDate(1);
    lastMonthBegin.setUTCHours(0);
    lastMonthBegin.setUTCMinutes(0);
    lastMonthBegin.setUTCSeconds(0);
    const begin = lastMonthBegin.toISOString();

    const lastMonthEnd = new Date();
    lastMonthEnd.setUTCDate(1);
    lastMonthEnd.setUTCHours(0);
    lastMonthEnd.setUTCMinutes(0);
    lastMonthEnd.setUTCSeconds(0);
    const end = lastMonthEnd.toISOString();

    const pupilRegisteredCount = await prisma.pupil.count({ where: { createdAt: { gte: begin, lte: end } } });
    const studentsRegisteredCount = await prisma.student.count({ where: { createdAt: { gte: begin, lte: end } } });
    const coursesCreatedCount = await prisma.subcourse.count({ where: { createdAt: { gte: begin, lte: end } } });

    await sendToSlack(SLACK_CHANNEL.PublicStatistics, {
        blocks: [
            table(`Statistiken vom ${begin} zum ${end}`, 'Name', 'Wert', [
                ['Anzahl registrierter Schüler', '' + pupilRegisteredCount],
                ['Anzahl registrierter Helfer', '' + studentsRegisteredCount],
                ['Anzahl erstellter Kurse', '' + coursesCreatedCount],
            ]),
        ],
    });
}
