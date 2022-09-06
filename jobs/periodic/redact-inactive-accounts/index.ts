import {getLogger} from "log4js";
import {EntityManager} from "typeorm";
import {prisma} from "../../../common/prisma";
import moment from "moment";

const logger = getLogger();

const GRACE_PERIOD = 30; // in days

export default async function execute(manager: EntityManager) {
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
                isRedacted: true
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

    logger.info(`Redacted ${redactedPupilsCount} pupils, ${redactedStudentsCount} students, and ${redactedMentorsCount} mentors.`);
}
