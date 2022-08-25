import { getLogger } from "log4js";
import { EntityManager } from "typeorm";
import { prisma } from "../../../common/prisma";
import moment from "moment";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    logger.info("Inactive account anonymization job will be executed...");

    // const pupilsToBeRedacted = await prisma.pupil.findMany({
    //     where: {
    //         active: false,
    //         updatedAt: {
    //             lt: moment().startOf('day')
    //                 .subtract(30, 'days')
    //                 .toDate()
    //         },
    //         isRedacted: false,
    //     }
    // });
    //
    // for (let pupil of pupilsToBeRedacted) {
    //     await prisma.pupil.update({
    //         where: {
    //             id: pupil.id
    //         },
    //         data: {
    //             firstname: "REDACTED",
    //             lastname: "REDACTED",
    //             email: "test+redacted+" + pupil.id + "@lern-fair.de", //email needs to be unique
    //             teacherEmailAddress: null,
    //             msg: null,
    //             isRedacted: true,
    //         }
    //     });
    //     logger.debug(`Redacted pupil with ID ${pupil.id}.`);
    // }

    //logger.info(`Redacted ${deletedPupils.count} pupils and ${deletedStudents.count} students.`);
}
