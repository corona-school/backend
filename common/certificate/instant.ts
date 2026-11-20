import { randomBytes } from 'crypto';
import { course_category_enum, Prisma, student as Student, student_screening_status_enum } from '@prisma/client';
import { prisma } from '../prisma';
import { userForStudent } from '../user';
import { getLectureScope } from '../student/internship';
import { getInstantCertificateStats, JOINED_BY_INTRODUCTION_DATE } from './duration';

// Most recent successful screening (tutor or instructor); falls back to registration date if none exists
export async function getStudentScreeningDate(requester: Pick<Student, 'id' | 'createdAt'>) {
    const { screening, instructor_screening } = await prisma.student.findUniqueOrThrow({
        where: { id: requester.id },
        select: {
            screening: { select: { status: true, decisionTakenAt: true, createdAt: true } },
            instructor_screening: { select: { status: true, decisionTakenAt: true, createdAt: true } },
        },
    });
    const dates = [screening, instructor_screening]
        .filter((s) => s?.status === student_screening_status_enum.success)
        .map((s) => (s.decisionTakenAt ?? s.createdAt).getTime());
    return dates.length ? new Date(Math.min(...dates)) : requester.createdAt;
}

export async function createInstantCertificateRecord(requester: Student, internshipId?: number) {
    const { internship, lectureScope } = await getLectureScope(requester, internshipId);
    const lectureScopeFilter: Prisma.lectureWhereInput[] = lectureScope ? [lectureScope] : [];

    const matchesCountPromise = prisma.match.count({
        where: {
            studentId: requester.id,
            lecture: {
                some: {
                    start: { lt: new Date() }, // only past lectures
                    isCanceled: false,
                    AND: lectureScopeFilter,
                    OR: [
                        {
                            // At this point joinedBy wasn't used yet.
                            start: { lt: JOINED_BY_INTRODUCTION_DATE },
                        },
                        {
                            // After the introduction of joinedBy, we only want to count lectures the student actually joined.
                            start: { gte: JOINED_BY_INTRODUCTION_DATE },
                            joinedBy: {
                                has: userForStudent(requester).userID,
                            },
                        },
                    ],
                },
            },
        },
    });
    const matchAppointmentsCountPromise = prisma.lecture.findMany({
        where: {
            start: { lt: new Date() }, // only past lectures
            isCanceled: false,
            match: {
                studentId: requester.id,
            },
            AND: lectureScopeFilter,
            OR: [
                {
                    start: { lt: JOINED_BY_INTRODUCTION_DATE },
                },
                {
                    start: { gte: JOINED_BY_INTRODUCTION_DATE },
                    joinedBy: {
                        has: userForStudent(requester).userID,
                    },
                },
            ],
        },
    });
    const uniqueCourseParticipantsPromise = prisma.subcourse_participants_pupil.groupBy({
        by: ['pupilId'],
        where: {
            subcourse: {
                cancelled: false,
                subcourse_instructors_student: { some: { studentId: requester.id } },
                course: { category: { not: course_category_enum.homework_help } },
                // Without a lecture in scope the participants didn't take part in this certificate's period
                ...(lectureScope && { lecture: { some: { isCanceled: false, start: { lt: new Date() }, AND: [lectureScope] } } }),
            },
        },
    });
    const courseAppointmentsAggregatePromise = prisma.lecture.findMany({
        where: {
            isCanceled: false,
            subcourse: {
                cancelled: false,
                subcourse_instructors_student: { some: { studentId: requester.id } },
                course: { category: { not: course_category_enum.homework_help } },
            },
            start: { lt: new Date() },
            AND: lectureScopeFilter,
            OR: [
                {
                    start: { lt: JOINED_BY_INTRODUCTION_DATE },
                },
                {
                    start: { gte: JOINED_BY_INTRODUCTION_DATE },
                    joinedBy: {
                        has: userForStudent(requester).userID,
                    },
                },
            ],
        },
        select: {
            actualDuration: true,
            duration: true,
            joinedBy: true,
            start: true,
        },
    });

    const appointmentsForDurationPromise = prisma.lecture.findMany({
        where: {
            isCanceled: false,
            start: { lt: new Date() },

            OR: [
                {
                    subcourse: {
                        cancelled: false,
                        subcourse_instructors_student: {
                            some: { studentId: requester.id },
                        },
                        course: {
                            category: { not: course_category_enum.homework_help },
                        },
                    },
                },
                {
                    match: {
                        studentId: requester.id,
                    },
                },
            ],

            AND: [
                ...lectureScopeFilter,
                {
                    OR: [
                        {
                            start: { lt: JOINED_BY_INTRODUCTION_DATE },
                        },
                        {
                            start: { gte: JOINED_BY_INTRODUCTION_DATE },
                            joinedBy: {
                                has: userForStudent(requester).userID,
                            },
                        },
                    ],
                },
            ],
        },
        select: {
            appointmentType: true,
            actualDuration: true,
            duration: true,
            joinedBy: true,
            start: true,
        },
    });

    const homeworkHelpDurationPromise = prisma.lecture.aggregate({
        where: {
            isCanceled: false,
            subcourse: { course: { category: course_category_enum.homework_help } },
            joinedBy: { has: userForStudent(requester).userID },
            AND: lectureScopeFilter,
        },
        _sum: { duration: true },
    });

    const [matchesCount, matchAppointments, courseParticipants, courseAppointments, appointmentsForDuration, homeworkHelpDuration] = await Promise.all([
        matchesCountPromise,
        matchAppointmentsCountPromise,
        uniqueCourseParticipantsPromise,
        courseAppointmentsAggregatePromise,
        appointmentsForDurationPromise,
        homeworkHelpDurationPromise,
    ]);
    const courseParticipantsCount = courseParticipants.length;
    const stats = getInstantCertificateStats({ matchAppointments, courseAppointments, appointmentsForDuration }, userForStudent(requester).userID);

    const screeningDate = await getStudentScreeningDate(requester);

    const certificate = await prisma.instant_certificate.create({
        data: {
            studentId: requester.id,
            uuid: randomBytes(6).toString('hex').toUpperCase(),
            startDate: internship ? internship.startDate : screeningDate,
            matchesCount,
            matchAppointmentsCount: stats.matchAppointmentsCount,
            totalMatchAppointmentsDuration: stats.totalMatchAppointmentsDuration,
            courseParticipantsCount,
            courseAppointmentsCount: stats.courseAppointmentsCount,
            totalCourseAppointmentDuration: stats.totalCourseAppointmentDuration,
            totalAppointmentsDuration: stats.totalAppointmentsDuration,
            homeworkHelpDuration: homeworkHelpDuration._sum.duration === 0 ? undefined : homeworkHelpDuration._sum.duration,
            trainingDuration: (requester.furtherTrainingsAttendedCount ?? 0) * 60,
            isInternship: !!internship,
        },
        include: { student: true },
    });

    return certificate;
}
