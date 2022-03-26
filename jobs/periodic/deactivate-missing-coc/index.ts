import {getLogger} from "log4js";
import { prisma } from "../../../common/prisma";
import {deactivateStudent} from "../../../common/student/activation";

const logger = getLogger();

export default async function execute() {
    logger.info("Missing CoC deactivation job: looking for students wo have not supplied CoC within 8 Weeks after registration...");
    await deactivateMissingCoc();
}

async function deactivateMissingCoc() {
    const today = new Date();
    const eightWeeksAgoDate = new Date();
    const twelveWeeksAgoDate = new Date();

    const eightWeeksAgo = today.getDate() - 56;
    eightWeeksAgoDate.setDate(eightWeeksAgo);

    const twelveWeeksAgo = today.getDate() - 96;
    twelveWeeksAgoDate.setDate(twelveWeeksAgo);

    const defaultingStudents = await prisma.student.findMany({
        where: {
            createdAt: {
                gt: new Date("2022-01-01")
            },
            active: true,
            OR: [{screening: {
                success: true,
                createdAt: {
                    lt: eightWeeksAgoDate
                }
            }}, {
                // eslint-disable-next-line camelcase
                project_coaching_screening: {
                    success: true,
                    createdAt: {
                        lt: eightWeeksAgoDate
                    }
                }}],
            NOT: {
                extendedCoCDeadline: true,
                createdAt: {
                    gt: twelveWeeksAgoDate
                }
            },
            // eslint-disable-next-line camelcase
            certificate_of_conduct: null
        }
    });

    logger.info(defaultingStudents.length+ " defaulting students are going to be removed because of a missing CoC");

    defaultingStudents.forEach(async (student) => {
        await deactivateStudent(student);
    });
}
