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
    status: ScreeningStatus;
    comment?: string;
    jobStatus?: screening_jobstatus_enum;
    knowsCoronaSchoolFrom?: string;
    skipCoC?: boolean;
}

const logger = getLogger('Student Screening');

export const requireStudentOnboarding = async (studentId: number, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) => {
    const student = await prisma.student.findFirst({ where: { id: studentId }, include: { instructor_screening: true, screening: true } });
    const hadSuccessfulScreening = student.screening?.status === ScreeningStatus.success || student.instructor_screening?.status === ScreeningStatus.success;
    if (!hadSuccessfulScreening) {
        await prismaInstance.student.update({ where: { id: studentId }, data: { hasDoneEthicsOnboarding: false } });
    }
};

export async function addInstructorScreening(screener: Screener, student: Student, screening: ScreeningInput, skipCoC: boolean) {
    if (screening.status === ScreeningStatus.success) {
        await requireStudentOnboarding(student.id);
    }

    await prisma.instructor_screening.create({
        data: {
            ...screening,
            screenerId: screener.id,
            studentId: student.id,
        },
    });

    if (screening.status === ScreeningStatus.success) {
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
    if (screening.status === ScreeningStatus.success) {
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
        if (screening.status === ScreeningStatus.success) {
            const asUser = userForStudent(student);
            await updateSessionRolesOfUser(asUser.userID);
            await scheduleCoCReminders(student);
            await Notification.actionTaken(userForStudent(student), 'tutor_screening_success', {});
        } else if (screening.status === ScreeningStatus.rejection) {
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

export async function updateStudentScreening(type: 'instructor' | 'tutor', screeningId: number, data: Partial<ScreeningInput>, screenerId?: number) {
    const screeningModel = type === 'instructor' ? prisma.instructor_screening : prisma.screening;
    const screeningModelLabel = type === 'instructor' ? 'InstructorScreening' : 'TutorScreening';
    const screening = await screeningModel.findFirst({ where: { id: screeningId }, include: { student: true } });

    if (screening === null) {
        logger.error(`cannot find ${screeningModelLabel}`, new Error(`cannot find ${screeningModelLabel}`), { screeningId: screening.id });
        throw new Error(`${screeningModelLabel} not found`);
    }

    const basicUpdate = {
        where: { id: screeningId },
        data: {
            comment: data.comment,
            jobStatus: data.jobStatus,
            knowsCoronaSchoolFrom: data.knowsCoronaSchoolFrom,
        },
    };

    type === 'instructor' ? await prisma.instructor_screening.update(basicUpdate) : await prisma.screening.update(basicUpdate);

    // For now we don't support change status from success/rejection
    if (screening.status === ScreeningStatus.success || screening.status === ScreeningStatus.rejection) {
        const { status, skipCoC, ...rest } = data;
        logger.info(`Screener(${screenerId}) updated ${screeningModelLabel} of Student(${screening.studentId})`, rest);
        return;
    }

    const statusUpdate = {
        where: { id: screeningId },
        data: { status: data.status },
    };
    type === 'instructor' ? await prisma.instructor_screening.update(statusUpdate) : await prisma.screening.update(statusUpdate);
    logger.info(`Screener(${screenerId}) updated ${screeningModelLabel} of Student(${screening.studentId})`, data);

    if (data.status === ScreeningStatus.success) {
        await requireStudentOnboarding(screening.studentId);
        const asUser = userForStudent(screening.student);
        await updateSessionRolesOfUser(asUser.userID);
        if (!data.skipCoC) {
            await scheduleCoCReminders(screening.student);
        } else {
            await logTransaction('skippedCoC', userForStudent(screening.student), { screenerId: screenerId });
            logger.info(`Skipped CoC for Student(${screening.student.id}) by Screener(${screenerId}) `);
        }
        await Notification.actionTaken(
            userForStudent(screening.student),
            type === 'instructor' ? 'instructor_screening_success' : 'tutor_screening_success',
            {}
        );
    } else if (data.status === ScreeningStatus.rejection) {
        await Notification.actionTaken(
            userForStudent(screening.student),
            type === 'instructor' ? 'instructor_screening_rejection' : 'tutor_screening_rejection',
            {}
        );
    }

    logger.info(`Screener(${screenerId}) updated ${screeningModelLabel} of Student(${screening.studentId})`, data);
}

export async function updateTutorScreening(screeningId: number, data: Partial<ScreeningInput>, screenerId?: number) {
    await updateStudentScreening('tutor', screeningId, data, screenerId);
}

export async function updateInstructorScreening(screeningId: number, data: Partial<ScreeningInput>, screenerId?: number) {
    await updateStudentScreening('instructor', screeningId, data, screenerId);
}
