import { getLogger } from '../../common/logger/logger';
import { prisma } from '../../common/prisma';
import { saveAppointmentStats } from '../../common/appointment/create';

const logger = getLogger();

export async function populateAppointmentStats() {
    logger.info('Populating appointment stats');
    const zoomMeetingReports = await prisma.lecture.findMany({
        where: {
            zoomMeetingReport: { hasSome: true },
        },
        select: {
            zoomMeetingReport: true,
            id: true,
        },
    });

    for (const lecture of zoomMeetingReports) {
        const report = lecture.zoomMeetingReport as any;
        await saveAppointmentStats(report, lecture);
    }

    logger.info('Appointment stats populated');
}
