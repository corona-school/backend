import {getLogger} from "log4js";
import { prisma } from "../../../common/prisma";
import validator from "validator";
import toDate = validator.toDate;
import {deactivateStudent} from "../../../common/student/activation";

const logger = getLogger();

export default async function execute() {
    logger.info("Missing CoC deactivation job: looking for students wo have not supplied CoC within 8 Weeks after registration...");
    await deactivateMissingCoc();
}

export async function deactivateMissingCoc() {
    const today = new Date();
    const eightWeeksAgoDate = new Date();
    var eightWeeksAgo = today.getDate() - 56;
    eightWeeksAgoDate.setDate(eightWeeksAgo);
    const defaultingStudents = await prisma.student.findMany({
        where: {
            createdAt: {
                gt: new Date("2021-11-01")
            },
            active: true,
            screening: {
                success: true,
                createdAt: {
                    lt: eightWeeksAgoDate
                }
            },
            sentCoCReminderCount: 5,
            // eslint-disable-next-line camelcase
            certificate_of_conduct: null
        }
    });

    logger.info(defaultingStudents.length+ " defaulting students are going to be removed because of a missing CoC");

    defaultingStudents.forEach(async (student) => {
        await deactivateStudent(student);
    });
}