import { prisma } from '../../../common/prisma';
import { getLogger } from '../../../common/logger/logger';
import moment from 'moment';
import { scheduleCoCReminders } from '../../../common/student/screening';
import { predictedHookActionDate } from '../../../common/notification';
import { userForStudent } from '../../../common/user';

const logger = getLogger();

export default async function execute() {
    const thirtyThreeMonthsAgo = moment().subtract(33, 'months').toDate();
    const twoMonthsAgo = moment().subtract(2, 'months').toDate();
    const activeStudentsWithoutCoC = await prisma.student.findMany({
        where: {
            active: true,
            lastLogin: {
                gt: twoMonthsAgo,
            },
            certificate_of_conduct: { is: null },
            OR: [{ screening: { status: 'success' } }, { instructor_screening: { status: 'success' } }],
        },
    });
    const studentsWithStaleCoC = await prisma.student.findMany({
        where: {
            active: true,
            lastLogin: {
                gt: twoMonthsAgo,
            },
            certificate_of_conduct: {
                dateOfIssue: {
                    lt: thirtyThreeMonthsAgo,
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
        await scheduleCoCReminders(student, /** ignoreAccCreationDate: */ false, /** isRenewal: */ true);
    }
    logger.info(`Scheduled CoC reminders for ${studentsWithStaleCoC.length} students.`);

    let scheduledForMissingCoC = 0;
    for (const student of activeStudentsWithoutCoC) {
        // Rescheduling cancels the pending deactivation, so students already in the countdown must be skipped
        const deactivationAlreadyScheduled = await predictedHookActionDate('coc_reminder', 'deactivate-student', userForStudent(student));
        if (deactivationAlreadyScheduled) {
            continue;
        }
        // We also treat these cases as renewals
        await scheduleCoCReminders(student, /** ignoreAccCreationDate: */ false, /** isRenewal: */ true);
        scheduledForMissingCoC++;
    }
    logger.info(`Scheduled CoC reminders for ${scheduledForMissingCoC} students without a CoC.`);
}
