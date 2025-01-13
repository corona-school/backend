import { Prisma, pupil as Pupil, student as Student } from '@prisma/client';

export function instructedBy(student: Student) {
    return {
        subcourse_instructors_student: { some: { studentId: { equals: student.id } } },
    };
}

export function joinedBy(pupil: Pupil) {
    return {
        subcourse_participants_pupil: {
            some: {
                pupilId: { equals: pupil.id },
            },
        },
    };
}

export function excludePastSubcourses(): Prisma.subcourseWhereInput {
    const prevDay = new Date();
    prevDay.setDate(prevDay.getDate() - 1);

    return {
        lecture: {
            some: {
                start: { gte: prevDay },
            },
        },
    };
}

export function excludeCancelledSubcourses(): Prisma.subcourseWhereInput {
    return {
        cancelled: false,
    };
}

export function onlyPastSubcourses(): Prisma.subcourseWhereInput {
    const prevDay = new Date();
    prevDay.setDate(prevDay.getDate() - 1);

    return {
        lecture: {
            every: {
                start: { lte: prevDay },
            },
        },
    };
}
