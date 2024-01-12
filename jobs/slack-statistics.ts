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

    // Screenings
    // Pupil screening - total
    const pupilScreeningCount = await prisma.pupil_screening.count({
        where: {
            createdAt: { gte: begin, lte: end },
        },
    });

    // Pupil screening - success
    const pupilScreeningSuccessCount = await prisma.pupil_screening.count({
        where: {
            createdAt: { gte: begin, lte: end },
            status: 'success',
        },
    });

    // Tutor screening - total
    const tutorScreeningCount = await prisma.screening.count({
        where: {
            createdAt: { gte: begin, lte: end },
        },
    });

    // Tutor screening - success
    const tutorScreeningSuccessCount = await prisma.screening.count({
        where: {
            createdAt: { gte: begin, lte: end },
            success: true,
        },
    });

    // Grouping 'knowsCoronaSchoolFrom' - Tutor
    const tutorKnowsCoronaSchoolFrom = await prisma.screening.groupBy({
        by: ['knowsCoronaSchoolFrom'],
        where: {
            createdAt: { gte: begin, lte: end },
            knowsCoronaSchoolFrom: { notIn: [''] },
        },
        _count: true,
    });

    let tutorKnowsCoronaSchoolFromTable: [string, string][] = [];
    tutorKnowsCoronaSchoolFromTable = tutorKnowsCoronaSchoolFrom.map((item) => [item['knowsCoronaSchoolFrom'], item['_count'].toString()]);

    // Instructor screening - total
    const instructorScreeningCount = await prisma.instructor_screening.count({
        where: {
            createdAt: { gte: begin, lte: end },
        },
    });

    // Instructor screening - success
    const instructorScreeningSuccessCount = await prisma.instructor_screening.count({
        where: {
            createdAt: { gte: begin, lte: end },
            success: true,
        },
    });

    // Grouping 'knowsCoronaSchoolFrom' - Instructor
    const instructorKnowsCoronaSchoolFrom = await prisma.instructor_screening.groupBy({
        by: ['knowsCoronaSchoolFrom'],
        where: {
            createdAt: { gte: begin, lte: end },
            knowsCoronaSchoolFrom: { notIn: [''] },
        },
        _count: true,
    });

    let instructorKnowsCoronaSchoolFromTable: [string, string][] = [];
    instructorKnowsCoronaSchoolFromTable = instructorKnowsCoronaSchoolFrom.map((item) => [item['knowsCoronaSchoolFrom'], item['_count'].toString()]);

    // Matches
    const matchCount = await prisma.match.count({
        where: {
            createdAt: { gte: begin, lte: end },
        },
    });

    // New subcourses created
    const subcourseCreatedCount = await prisma.subcourse.count({
        where: {
            createdAt: { gte: begin, lte: end },
        },
    });

    // Number of free / taken seats of current public subcourses
    const subcourseSeats = await prisma.subcourse.findMany({
        select: {
            course: {
                select: {
                    name: true,
                },
            },
            maxParticipants: true,
            subcourse_participants_pupil: {
                select: {
                    pupilId: true,
                },
            },
        },
        where: {
            lecture: {
                every: { start: { lt: end } },
                some: { start: { gte: begin, lt: end } },
            },
            published: true,
        },
    });

    let subcourseSeatsTakenTable: [string, string][] = [];
    subcourseSeatsTakenTable = subcourseSeats.map((item) => [item.course.name, item.subcourse_participants_pupil.length + ' von ' + item.maxParticipants]);

    // Match appointments
    const matchAppointmentCount = await prisma.lecture.count({
        where: {
            createdAt: { gte: begin, lte: end },
            matchId: { not: { equals: null } },
        },
    });

    await sendToSlack(SLACK_CHANNEL.PublicStatistics, {
        blocks: [
            ...table(`Statistiken vom ${begin} zum ${end}`, 'Name', 'Wert', [
                ['Anzahl registrierter Schüler*innen', '' + pupilRegisteredCount],
                ['Anzahl registrierter Helfer*innen', '' + studentsRegisteredCount],
                ['Anzahl erfolgreicher Screenings Schüler*innen', '' + pupilScreeningSuccessCount + ' von ' + pupilScreeningCount],
                ['Anzahl erfolgreicher Screenings Helfer*innen', '' + tutorScreeningSuccessCount + ' von ' + tutorScreeningCount],
                ['Anzahl erfolgreicher Screenings Kursleiter*innen', '' + instructorScreeningSuccessCount + ' von ' + instructorScreeningCount],
                ['Anzahl erstellter Matches', '' + matchCount],
                ['Anzahl erstellter Kurse', '' + subcourseCreatedCount],
                ['Anzahl Match-Termine', '' + matchAppointmentCount],
            ]),
            ...table('Von uns gehört durch... (Helfer*innen)', 'Name', 'Wert', tutorKnowsCoronaSchoolFromTable),
            ...table('Von uns gehört durch... (Kursleiter*innen)', 'Name', 'Wert', instructorKnowsCoronaSchoolFromTable),
            ...table('Anzahl der belegten Plätze in den aktuellen Kursen', 'Name', 'Wert', subcourseSeatsTakenTable),
        ],
    });
}
