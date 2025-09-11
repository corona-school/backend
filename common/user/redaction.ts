import { pupil as Pupil, student as Student, screener as Screener } from '@prisma/client';
import { deleteAttachment } from '../attachments';
import { getLogger } from '../logger/logger';
import { ConcreteNotificationState } from '../notification/types';
import { prisma } from '../prisma';
import { userForPupil, userForStudent } from '.';

const logger = getLogger();

// These two constants are used to replace the names of redacted accounts.
// We are using more descriptive names to make it easier to identify them by our users in case the names are still shown somewhere.
const REDACTED_FIRST_NAME = 'Account';
const REDACTED_LAST_NAME = 'gelöscht';

export default async function redactUsers(persons: { pupils: Pupil[]; students: Student[]; screener: Screener[] }) {
    logger.info(`${persons.pupils.length} pupils, ${persons.students.length} students and ${persons.screener.length} screeners to be redacted`);

    let redactedPupilsCount = 0;
    for (const pupil of persons.pupils) {
        await prisma.pupil.update({
            where: {
                id: pupil.id,
            },
            data: {
                firstname: REDACTED_FIRST_NAME,
                lastname: REDACTED_LAST_NAME,
                email: 'test+redacted+p+' + pupil.id + '@lern-fair.de', //email needs to be unique
                teacherEmailAddress: null,
                msg: null,
                isRedacted: true,
                matchReason: '',
                aboutMe: '',
                descriptionForMatch: '',
                descriptionForScreening: '',
                referredById: null,
            },
        });
        logger.debug(`Redacted pupil with ID ${pupil.id}.`);
        redactedPupilsCount++;
    }

    let redactedStudentsCount = 0;
    for (const student of persons.students) {
        await prisma.student.update({
            where: {
                id: student.id,
            },
            data: {
                firstname: REDACTED_FIRST_NAME,
                lastname: REDACTED_LAST_NAME,
                email: 'test+redacted+s+' + student.id + '@lern-fair.de', //email needs to be unique
                msg: null,
                phone: null,
                feedback: null,
                newsletter: false,
                isRedacted: true,
                aboutMe: '',
                descriptionForMatch: '',
                descriptionForScreening: '',
                referredById: null,
            },
        });
        logger.debug(`Redacted student with ID ${student.id}.`);
        redactedStudentsCount++;
    }

    let redactedScreenersCount = 0;
    for (const screener of persons.screener) {
        await prisma.screener.update({
            where: {
                id: screener.id,
            },
            data: {
                firstname: REDACTED_FIRST_NAME,
                lastname: REDACTED_LAST_NAME,
                email: 'test+redacted+sc+' + screener.id + '@lern-fair.de', //email needs to be unique
                isRedacted: true,
            },
        });
        logger.debug(`Redacted screener with ID ${screener.id}.`);
        redactedScreenersCount++;
    }

    // drop context of concrete notifications
    await prisma.concrete_notification.updateMany({
        where: {
            userId: {
                in: [
                    ...persons.pupils.map((p) => `pupil/${p.id}`),
                    ...persons.students.map((s) => `student/${s.id}`),
                    ...persons.screener.map((s) => `screener/${s.id}`),
                ],
            },
            state: {
                in: [ConcreteNotificationState.ACTION_TAKEN, ConcreteNotificationState.SENT, ConcreteNotificationState.ERROR],
            },
        },
        data: {
            context: {},
            state: ConcreteNotificationState.ARCHIVED,
        },
    });

    // remove signature from certificates where pupil is to be redacted
    await prisma.participation_certificate.updateMany({
        where: {
            pupilId: {
                in: persons.pupils.map((p) => p.id),
            },
        },
        data: {
            signaturePupil: null,
            signatureParent: null,
        },
    });

    // remove all the open participation certificates where the student is to be redacted
    await prisma.participation_certificate.deleteMany({
        where: {
            studentId: {
                in: persons.students.map((s) => s.id),
            },
            state: 'awaiting-approval',
        },
    });

    // remove attachments' files from S3 bucket if associated user is to be redacted
    const attachmentsToBeDeleted = await prisma.attachment.findMany({
        where: {
            uploaderID: {
                in: [
                    ...persons.pupils.map((p) => `pupil/${p.id}`),
                    ...persons.students.map((s) => `student/${s.id}`),
                    ...persons.screener.map((s) => `screener/${s.id}`),
                ],
            },
        },
    });

    for (const attachment of attachmentsToBeDeleted) {
        await deleteAttachment(attachment);
    }

    // remove transaction logs where userID corresponds to user who is to be redacted
    await prisma.log.deleteMany({
        where: {
            userID: {
                in: [...persons.pupils.map((p) => userForPupil(p).userID), ...persons.students.map((s) => userForStudent(s).userID)],
            },
        },
    });

    logger.info(`Redacted ${redactedPupilsCount} pupils, ${redactedStudentsCount} students, ${redactedScreenersCount} screeners.`);
}
