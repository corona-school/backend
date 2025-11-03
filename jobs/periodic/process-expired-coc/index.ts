import { prisma } from '../../../common/prisma';
import { getLogger } from '../../../common/logger/logger';
import moment from 'moment';
import { scheduleCoCReminders } from '../../../common/student/screening';

const logger = getLogger();

export default async function execute() {
    const threeYearsAgo = moment().subtract(3, 'years').toDate();
    const twoMonthsAgo = moment().subtract(2, 'months').toDate();
    const studentsWithStaleCoC = await prisma.student.findMany({
        where: {
            active: true,
            lastLogin: {
                gt: twoMonthsAgo,
            },
            certificate_of_conduct: {
                dateOfIssue: {
                    lt: threeYearsAgo,
                },
            },
        },
    });
    // Delete stale CoCs and cancel remission requests
    await prisma.certificate_of_conduct.deleteMany({
        where: {
            studentId: { in: studentsWithStaleCoC.map((s) => s.id) },
        },
    });
    await prisma.remission_request.deleteMany({
        where: {
            studentId: { in: studentsWithStaleCoC.map((s) => s.id) },
        },
    });
    logger.info(`Deleted ${studentsWithStaleCoC.length} stale CoCs and their associated remission requests.`);
    for (const student of studentsWithStaleCoC) {
        await scheduleCoCReminders(student);
    }
    logger.info(`Scheduled CoC reminders for ${studentsWithStaleCoC.length} students.`);
}
