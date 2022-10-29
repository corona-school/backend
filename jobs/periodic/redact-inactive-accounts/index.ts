import {getLogger} from "log4js";
import {prisma} from "../../../common/prisma";
import moment from "moment";
import {deleteAttachment} from "../../../common/attachments";
import {ConcreteNotificationState} from "../../../common/notification/types";

const logger = getLogger();

const GRACE_PERIOD = 30; // in days

export default async function execute() {
    logger.info("Inactive account redaction job will be executed...");

    const pupilsToBeRedacted = await prisma.pupil.findMany({
        where: {
            active: false,
            updatedAt: {
                lt: moment().startOf('day')
                    .subtract(GRACE_PERIOD, 'days')
                    .toDate()
            },
            isRedacted: false
        }
    });

    const studentsToBeRedacted = await prisma.student.findMany({
        where: {
            active: false,
            updatedAt: {
                lt: moment().startOf('day')
                    .subtract(GRACE_PERIOD, 'days')
                    .toDate()
            },
            isRedacted: false
        }
    });

    const mentorsToBeRedacted = await prisma.mentor.findMany({
        where: {
            active: false,
            updatedAt: {
                lt: moment().startOf('day')
                    .subtract(GRACE_PERIOD, 'days')
                    .toDate()
            },
            isRedacted: false
        }
    });

    logger.info(`${pupilsToBeRedacted.length} pupils, ${studentsToBeRedacted.length} students, and ${mentorsToBeRedacted.length} mentors to be redacted`);

    let redactedPupilsCount = 0;
    for (let pupil of pupilsToBeRedacted) {
        await prisma.pupil.update({
            where: {
                id: pupil.id
            },
            data: {
                firstname: "REDACTED",
                lastname: "REDACTED",
                email: "test+redacted+p+" + pupil.id + "@lern-fair.de", //email needs to be unique
                teacherEmailAddress: null,
                msg: null,
                isRedacted: true,
                matchReason: '',
            }
        });
        logger.debug(`Redacted pupil with ID ${pupil.id}.`);
        redactedPupilsCount++;
    }

    let redactedStudentsCount = 0;
    for (let student of studentsToBeRedacted) {
        await prisma.student.update({
            where: {
                id: student.id
            },
            data: {
                firstname: "REDACTED",
                lastname: "REDACTED",
                email: "test+redacted+s+" + student.id + "@lern-fair.de", //email needs to be unique
                msg: null,
                phone: null,
                feedback: null,
                newsletter: false,
                isRedacted: true
            }
        });
        logger.debug(`Redacted student with ID ${student.id}.`);
        redactedStudentsCount++;
    }

    let redactedMentorsCount = 0;
    for (let mentor of mentorsToBeRedacted) {
        await prisma.mentor.update({
            where: {
                id: mentor.id
            },
            data: {
                firstname: "REDACTED",
                lastname: "REDACTED",
                email: "test+redacted+m+" + mentor.id + "@lern-fair.de", //email needs to be unique
                message: null,
                description: null,
                imageUrl: null,
                isRedacted: true
            }
        });
        logger.debug(`Redacted mentor with ID ${mentor.id}.`);
        redactedMentorsCount++;
    }

    // drop context of concrete notifications
    await prisma.concrete_notification.updateMany({
        where:
            {
                userId: {
                    in: [...pupilsToBeRedacted.map(p => `pupil/${p.id}`),
                         ...studentsToBeRedacted.map(s => `student/${s.id}`),
                         ...mentorsToBeRedacted.map(m => `mentor/${m.id}`)]
                },
                state: {
                    in: [
                        ConcreteNotificationState.ACTION_TAKEN,
                        ConcreteNotificationState.SENT,
                        ConcreteNotificationState.ERROR
                    ]
                }
            },
        data: {
            context: {},
            state: ConcreteNotificationState.ARCHIVED
        }
    });

    // remove signature from certificates where pupil is to be redacted
    await prisma.participation_certificate.updateMany({
        where: {
            pupilId: {
                in: pupilsToBeRedacted.map(p => p.id)
            }
        },
        data: {
            signaturePupil: null,
            signatureParent: null
        }
    });

    // remove attachments' files from S3 bucket if associated user is to be redacted
    const attachmentsToBeDeleted = await prisma.attachment.findMany({
        where: {
            uploaderID: {
                in: [...pupilsToBeRedacted.map(p => `pupil/${p.id}`),
                     ...studentsToBeRedacted.map(s => `student/${s.id}`),
                     ...mentorsToBeRedacted.map(m => `mentor/${m.id}`)]
            }
        }
    });

    for (let attachment of attachmentsToBeDeleted) {
        await deleteAttachment(attachment);
    }

    // remove transaction logs where wix id corresponds to user who is to be redacted
    await prisma.log.deleteMany({
        where: {
            user: {
                in: [...pupilsToBeRedacted.map(p => p.wix_id),
                     ...studentsToBeRedacted.map(s => s.wix_id),
                     ...mentorsToBeRedacted.map(m => m.wix_id)]
            }
        }
    });

    logger.info(`Redacted ${redactedPupilsCount} pupils, ${redactedStudentsCount} students, and ${redactedMentorsCount} mentors.`);
}
