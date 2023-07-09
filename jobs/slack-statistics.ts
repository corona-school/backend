import { prisma } from "../common/prisma";
import { sendToSlack, SLACK_CHANNEL } from "../common/slack";
import { table } from "../common/slack/blocks";

export async function postStatisticsToSlack() {
    const lastMonthBegin = new Date();
    lastMonthBegin.setMonth(lastMonthBegin.getMonth() - 1);
    lastMonthBegin.setDate(1);
    const begin = lastMonthBegin.toISOString();

    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(-1);
    const end = lastMonthEnd.toISOString();


    const pupilRegisteredCount = await prisma.pupil.count({ where: { createdAt: { gte: begin, lte: end } }});
    const studentsRegisteredCount = await prisma.student.count({ where: { createdAt: { gte: begin, lte: end }}});

    await sendToSlack(SLACK_CHANNEL.PublicStatistics, {
        blocks: [
            table(`Statistiken vom ${begin} zum ${end}`, "Name", "Wert", [
                ["Anzahl registrierter Schüler", "" + pupilRegisteredCount],
                ["Anzahl registrierter Helfer", "" + studentsRegisteredCount]
            ])
        ]
    });
}