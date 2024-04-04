import { getLogger } from '../../../common/logger/logger';
import { prisma } from '../../../common/prisma';
import moment from 'moment';
import { deleteAttachment } from '../../../common/attachments';
import { ConcreteNotificationState } from '../../../common/notification/types';
import { findAllPersons } from './query';
import { userForPupil, userForStudent } from '../../../common/user';

const logger = getLogger();

export const GRACE_PERIOD = 4 * 365; // three years in days

// These two constants are used to replace the names of redacted accounts.
// We are using more descriptive names to make it easier to identify them by our users in case the names are still shown somewhere.
const REDACTED_FIRST_NAME = 'Account';
const REDACTED_LAST_NAME = 'gelöscht';

export default async function execute() {
    logger.info('Inactive account redaction job will be executed...');
    const persons = await findAllPersons(false, moment().startOf('day').subtract(GRACE_PERIOD, 'days').toDate());

    logger.info(
        `${persons.pupils.length} pupils, ${persons.students.length} students, ${persons.screener.length} screeners, and ${persons.mentors.length} mentors to be redacted`
    );

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

    let redactedMentorsCount = 0;
    for (const mentor of persons.mentors) {
        await prisma.mentor.update({
            where: {
                id: mentor.id,
            },
            data: {
                firstname: REDACTED_FIRST_NAME,
                lastname: REDACTED_LAST_NAME,
                email: 'test+redacted+m+' + mentor.id + '@lern-fair.de', //email needs to be unique
                message: null,
                description: null,
                imageUrl: null,
                isRedacted: true,
            },
        });
        logger.debug(`Redacted mentor with ID ${mentor.id}.`);
        redactedMentorsCount++;
    }

    // drop context of concrete notifications
    await prisma.concrete_notification.updateMany({
        where: {
            userId: {
                in: [
                    ...persons.pupils.map((p) => `pupil/${p.id}`),
                    ...persons.students.map((s) => `student/${s.id}`),
                    ...persons.screener.map((s) => `screener/${s.id}`),
                    ...persons.mentors.map((m) => `mentor/${m.id}`),
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
                    ...persons.mentors.map((m) => `mentor/${m.id}`),
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
                in: [...persons.pupils.map((p) => userForPupil(p).userID), ...persons.students.map((s) => userForStudent(s).userID)], // ...persons.mentors.map((m) => m.wix_id)
            },
        },
    });

    logger.info(
        `Redacted ${redactedPupilsCount} pupils, ${redactedStudentsCount} students, ${redactedScreenersCount} screeners, and ${redactedMentorsCount} mentors.`
    );
}
