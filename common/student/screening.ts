import { student as Student, screener as Screener, Prisma, PrismaClient, student_screening_status_enum as ScreeningStatus } from '@prisma/client';
import { prisma } from '../prisma';
import * as Notification from '../notification';
import { getLogger } from '../../common/logger/logger';
import { createRemissionRequest } from '../remission-request';
import { screening_jobstatus_enum } from '../../graphql/generated';
import { RedundantError } from '../util/error';
import { logTransaction } from '../transactionlog/log';
import { userForStudent } from '../user';
import { updateSessionRolesOfUser } from '../user/session';

interface ScreeningInput {
    success: boolean;
    status: ScreeningStatus;
    comment?: string;
    jobStatus?: screening_jobstatus_enum;
    knowsCoronaSchoolFrom?: string;
}

const logger = getLogger('Student Screening');

export const requireStudentOnboarding = async (studentId: number, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) => {
    const student = await prisma.student.findFirst({ where: { id: studentId }, include: { instructor_screening: true, screening: true } });
    const hadSuccessfulScreening = student.screening?.success || student.instructor_screening?.success;
    if (!hadSuccessfulScreening) {
        await prismaInstance.student.update({ where: { id: studentId }, data: { hasDoneEthicsOnboarding: false } });
    }
};

export async function addInstructorScreening(screener: Screener, student: Student, screening: ScreeningInput, skipCoC: boolean) {
    if (screening.success) {
        await requireStudentOnboarding(student.id);
    }

    await prisma.instructor_screening.create({
        data: {
            ...screening,
            screenerId: screener.id,
            studentId: student.id,
        },
    });

    if (screening.success) {
        if (!skipCoC) {
            await scheduleCoCReminders(student);
        } else {
            await logTransaction('skippedCoC', userForStudent(student), { screenerId: screener.id });
            logger.info(`Skipped CoC for Student (${student.id}) by Screener (${screener.id}) `);
        }

        const asUser = userForStudent(student);
        await Notification.actionTaken(asUser, 'instructor_screening_success', {});
        await updateSessionRolesOfUser(asUser.userID);
    } else {
        await Notification.actionTaken(userForStudent(student), 'instructor_screening_rejection', {});
    }

    logger.info(`Screener(${screener.id}) instructor screened Student(${student.id})`, screening);
}

export async function addTutorScreening(
    screener: Screener,
    student: Student,
    screening: ScreeningInput,
    prismaInstance: Prisma.TransactionClient | PrismaClient = prisma,
    batchMode = false
) {
    if (screening.success) {
        await requireStudentOnboarding(student.id, prismaInstance);
    }

    await prismaInstance.screening.create({
        data: {
            ...screening,
            screenerId: screener.id,
            studentId: student.id,
        },
    });

    if (!batchMode) {
        if (screening.success) {
            const asUser = userForStudent(student);
            await updateSessionRolesOfUser(asUser.userID);
            await scheduleCoCReminders(student);
            await Notification.actionTaken(userForStudent(student), 'tutor_screening_success', {});
        } else {
            await Notification.actionTaken(userForStudent(student), 'tutor_screening_rejection', {});
        }
    }

    logger.info(`Screener(${screener.id}) tutor screened Student(${student.id})`, screening);
}

export async function scheduleCoCReminders(student: Student, ignoreAccCreationDate = false) {
    if (student.createdAt < new Date('2022-01-01') && !ignoreAccCreationDate) {
        return;
    }

    const existingCoC = await prisma.certificate_of_conduct.count({ where: { studentId: student.id } });
    if (existingCoC > 0) {
        throw new RedundantError('Student already handed in a CoC');
    }

    await cancelCoCReminders(student);
    await createRemissionRequest(student);
    await Notification.actionTaken(userForStudent(student), 'coc_reminder', {});
}

export async function cancelCoCReminders(student: Student) {
    await Notification.actionTaken(userForStudent(student), 'coc_cancelled', {});
    await logTransaction('cocCancel', userForStudent(student), { studentId: student.id });
}

export async function updateTutorScreening(screeningId: number, data: Pick<ScreeningInput, 'comment'>, screenerId?: number) {
    const screening = await prisma.screening.update({
        where: {
            id: screeningId,
        },
        data: {
            comment: data.comment,
        },
        include: { student: true },
    });
    logger.info(`Screener(${screenerId}) updated tutor screening of Student(${screening.studentId})`, data);
}

export async function updateInstructorScreening(screeningId: number, data: Pick<ScreeningInput, 'comment'>, screenerId?: number) {
    const screening = await prisma.instructor_screening.update({
        where: {
            id: screeningId,
        },
        data: {
            comment: data.comment,
        },
        include: { student: true },
    });
    logger.info(`Screener(${screenerId}) updated instructor screening of Student(${screening.studentId})`, data);
}
