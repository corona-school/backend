import { student as Student, screener as Screener, Prisma, PrismaClient } from '@prisma/client';
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
    comment?: string;
    jobStatus?: screening_jobstatus_enum;
    knowsCoronaSchoolFrom?: string;
}

const logger = getLogger('Student Screening');

export async function addInstructorScreening(screener: Screener, student: Student, screening: ScreeningInput, skipCoC: boolean) {
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
