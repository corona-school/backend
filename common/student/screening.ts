import { student as Student, screener as Screener, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import * as Notification from '../notification';
import { getLogger } from '../../common/logger/logger';
import { createRemissionRequest } from '../remission-request';
import { getTransactionLog } from '../transactionlog';
import CoCCancelledEvent from '../transactionlog/types/CoCCancelledEvent';

interface ScreeningInput {
    success: boolean;
    comment?: string;
    knowsCoronaSchoolFrom?: string;
}

const logger = getLogger('Student Screening');

export async function addInstructorScreening(screener: Screener, student: Student, screening: ScreeningInput) {
    await prisma.instructor_screening.create({
        data: {
            ...screening,
            screenerId: screener.id,
            studentId: student.id,
        },
    });

    if (screening.success) {
        await scheduleCoCReminders(student);
        await Notification.actionTaken(student, 'instructor_screening_success', {});
    } else {
        await Notification.actionTaken(student, 'instructor_screening_rejection', {});
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
    await prismaInstance.screening.create({
        data: {
            ...screening,
            screenerId: screener.id,
            studentId: student.id,
        },
    });

    if (!batchMode) {
        if (screening.success) {
            await scheduleCoCReminders(student);
            await Notification.actionTaken(student, 'tutor_screening_success', {});
        } else {
            await Notification.actionTaken(student, 'tutor_screening_rejection', {});
        }
    }

    logger.info(`Screener(${screener.id}) tutor screened Student(${student.id})`, screening);
}

export async function scheduleCoCReminders(student: Student, ignoreAccCreationDate = false) {
    if (student.createdAt < new Date('2022-01-01') && !ignoreAccCreationDate) {
        return;
    }

    const remissionRequest = await prisma.remission_request.findUnique({
        where: { studentId: student.id },
    });

    if (remissionRequest) {
        return;
    }

    await createRemissionRequest(student);
    await Notification.actionTaken(student, 'coc_reminder', {});
}

export async function cancelCoCReminders(student: Student) {
    const transactionLog = getTransactionLog();

    await Notification.actionTaken(student, 'coc_cancelled', {});
    await transactionLog.log(new CoCCancelledEvent(student));
}
