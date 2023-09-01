import { prisma } from "../common/prisma";
import { sendToSlack, SLACK_CHANNEL } from "../common/slack";
import { table } from "../common/slack/blocks";

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

    //Screenings
    const pupilScreeningCount = await prisma.pupil_screening.count({ where: { createdAt: { gte: begin, lte: end } } });
    const tutorScreeningCount = await prisma.screening.count({ where: { createdAt: { gte: begin, lte: end } } });
    const instructorScreeningCount = await prisma.instructor_screening.count({ where: { createdAt: { gte: begin, lte: end } } });
    const tutorScreeningCountGroupBy = await prisma.screening.groupBy({
        by: ['knowsCoronaSchoolFrom'],
        where: { createdAt: { gte: begin, lte: end } },
        _count: { success: true },
    });
    const instructorScreeningCountGroupBy = await prisma.instructor_screening.groupBy({
        by: ['knowsCoronaSchoolFrom'],
        where: { createdAt: { gte: begin, lte: end } },
        _count: { success: true },
    });

    //Matches
    const matchCount = await prisma.match.count({ where: { createdAt: { gte: begin, lte: end } } });

    //Subcourses
    const subcourseCreatedCount = await prisma.subcourse.count({ where: { createdAt: { gte: begin, lte: end } } });
    //TODO: number of free / taken seats of current public subcourses

    //Match appointments
    const matchAppointmentCount = await prisma.lecture.count({
        where: {
            createdAt: { gte: begin, lte: end },
            matchId: {
                notIn: [],
            },
        },
    });

    await sendToSlack(SLACK_CHANNEL.PublicStatistics, {
        blocks: [
            table(`Statistiken vom ${begin} zum ${end}`, 'Name', 'Wert', [
                ['Anzahl registrierter Schüler*innen', '' + pupilRegisteredCount],
                ['Anzahl registrierter Helfer*innen', '' + studentsRegisteredCount],
                ['Anzahl Screenings Schüler*innen', '' + pupilScreeningCount],
                ['Anzahl Screenings Helfer*innen', '' + tutorScreeningCount],
                ['Anzahl Screenings Lehrer*innen', '' + instructorScreeningCount],
                ['Anzahl erstellter Matches', '' + matchCount],
                ['Anzahl erstellter Kurse', '' + subcourseCreatedCount],
                ['Anzahl Match-Termine', '' + matchAppointmentCount],
            ]),
            //TODO: Tables for screenings (knowsCoronaSchoolFrom)
            //TODO: Table for free/taken seats for subcourses
        ],
    });
}