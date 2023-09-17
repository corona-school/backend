import { prisma } from '../../../common/prisma';
import { getLogger } from '../../../common/logger/logger';

const DELETE_AFTER = 7; // in days
const logger = getLogger();

export default async function execute() {
    await prisma.course_attendance_log.updateMany({
        where: { createdAt: { lt: new Date(Date.now() - DELETE_AFTER * 24 * 60 * 60 * 1000) } },
        data: { ip: '' },
    });
    logger.info(`Removed IP Address and PupilID from attendance logs, which are older then 7 days.`);
}
