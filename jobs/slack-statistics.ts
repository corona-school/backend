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
        _count: {
            createdAt: true,
        },
    });

    const tutorKnowsCoronaSchoolFromValue = tutorKnowsCoronaSchoolFrom.map(function (item) {
        return item['knowsCoronaSchoolFrom'];
    });

    const tutorKnowsCoronaSchoolFromCount = tutorKnowsCoronaSchoolFrom.map(function (item) {
        return String(item['_count']['createdAt']);
    });

    const tutorKnowsCoronaSchoolFromTable: [string, string][] = [];
    for (let i = 0; i < tutorKnowsCoronaSchoolFromValue.length; i++) {
        tutorKnowsCoronaSchoolFromTable[i] = [tutorKnowsCoronaSchoolFromValue[i], tutorKnowsCoronaSchoolFromCount[i]];
    }

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
        _count: {
            createdAt: true,
        },
    });

    const instructorKnowsCoronaSchoolFromValue = instructorKnowsCoronaSchoolFrom.map(function (item) {
        return item['knowsCoronaSchoolFrom'];
    });

    const instructorKnowsCoronaSchoolFromCount = instructorKnowsCoronaSchoolFrom.map(function (item) {
        return String(item['_count']['createdAt']);
    });

    const instructorKnowsCoronaSchoolFromTable: [string, string][] = [];
    for (let i = 0; i < instructorKnowsCoronaSchoolFromValue.length; i++) {
        instructorKnowsCoronaSchoolFromTable[i] = [instructorKnowsCoronaSchoolFromValue[i], instructorKnowsCoronaSchoolFromCount[i]];
    }

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

    // Number of current subcourses
    const subcourseCurrentCount = await prisma.subcourse.count();

    // TODO: number of free / taken seats of current public subcourses
    const subcourseSeats = await prisma.course.findMany({
        select: {
            id: true,
            name: true,
            subcourse: {
                select: {
                    maxParticipants: true,
                    // eslint-disable-next-line camelcase
                    subcourse_participants_pupil: {
                        select: {
                            pupilId: true,
                        },
                    },
                },
            },
        },
    });

    const subcourseSeatsCount = subcourseSeats.map((course) => {
        const subcourses = course.subcourse;
        const totalSeats = subcourses.reduce((acc, subcourse) => acc + subcourse.maxParticipants, 0);
        const takenSeats = subcourses.reduce((acc, subcourse) => acc + subcourse.subcourse_participants_pupil.length, 0);
        const availableSeats = totalSeats - takenSeats;

        return {
            courseName: course.name,
            totalSeats,
            takenSeats,
            availableSeats,
        };
    });

    const subcourseSeatsTakenTable: [string, string][] = [];
    for (let i = 0; i < subcourseSeatsCount.length; i++) {
        subcourseSeatsTakenTable[i] = [
            subcourseSeatsCount[i].courseName,
            String(subcourseSeatsCount[i].takenSeats + ' von ' + subcourseSeatsCount[i].totalSeats),
        ];
    }

    // Match appointments
    const matchAppointmentCount = await prisma.lecture.count({
        where: {
            createdAt: { gte: begin, lte: end },
            matchId: { notIn: 0 },
        },
    });

    await sendToSlack(SLACK_CHANNEL.PublicStatistics, {
        blocks: [
            table(`Statistiken vom ${begin} zum ${end}`, 'Name', 'Wert', [
                ['Anzahl registrierter Schüler*innen', '' + pupilRegisteredCount],
                ['Anzahl registrierter Helfer*innen', '' + studentsRegisteredCount],
                ['Anzahl erfolgreicher Screenings Schüler*innen', '' + pupilScreeningSuccessCount + ' von ' + pupilScreeningCount],
                ['Anzahl erfolgreicher Screenings Helfer*innen', '' + tutorScreeningSuccessCount + ' von ' + tutorScreeningCount],
                ['Anzahl erfolgreicher Screenings Lehrer*innen', '' + instructorScreeningSuccessCount + ' von ' + instructorScreeningCount],
                ['Anzahl erstellter Matches', '' + matchCount],
                ['Anzahl erstellter Kurse', '' + subcourseCreatedCount],
                ['Anzahl aktueller Kurse', '' + subcourseCurrentCount],
                ['Anzahl Match-Termine', '' + matchAppointmentCount],
            ]),
            table('Von uns gehört durch... (Helfer*innen)', 'Name', 'Wert', tutorKnowsCoronaSchoolFromTable),
            table('Von uns gehört durch... (Lehrer*innen)', 'Name', 'Wert', instructorKnowsCoronaSchoolFromTable),
            table('Anzahl der belegten Plätze in den aktuellen Kursen', 'Name', 'Wert', subcourseSeatsTakenTable),
        ],
    });
}
