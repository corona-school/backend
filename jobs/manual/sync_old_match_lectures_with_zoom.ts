import { prisma } from '../../common/prisma';
import { lecture as Appointment } from '@prisma/client';
import { getPastZoomMeetingParticipants, ZoomMeetingReport } from '../../common/zoom/scheduled-meeting';
import { getLogger } from '../../common/logger/logger';
import { ZoomError } from '../../common/util/error';
import { getSharedMeetingTimeInSeconds } from '../../common/zoom/util';

const logger = getLogger('SyncOldMatchLecturesWithZoom');
const CONCURRENCY = 5;

export async function syncOldMatchLecturesWithZoom(): Promise<void> {
    const lectures = (await prisma.$queryRaw`
        SELECT lecture."id", lecture."zoomMeetingId", lecture."participantIds", lecture."organizerIds"
        FROM lecture
        INNER JOIN match ON match.id = lecture."matchId"
        INNER JOIN student ON student.id = match."studentId"
        WHERE lecture."createdAt" >= '2025-04-01'
            AND lecture."isCanceled" IS FALSE
            AND lecture."appointmentType" = 'match'
            AND lecture."zoomMeetingId" IS NOT NULL
            AND array_length(lecture."declinedBy", 1) IS NULL
            AND array_length(lecture."joinedBy", 1) = 1
            AND student."zoomUserId" IS NOT NULL
            AND lecture."actualDuration" = 0
        ORDER BY lecture."start" ASC
    `) as Appointment[];

    logger.info(`Found ${lectures.length} lectures to sync with Zoom.`);
    const migratedLectures: string[] = [];
    const failedLectures: string[] = [];

    for (let i = 0; i < lectures.length; i += CONCURRENCY) {
        const chunk = lectures.slice(i, i + CONCURRENCY);

        await Promise.all(
            chunk.map(async (lecture) => {
                try {
                    const participants = await getParticipants(lecture.zoomMeetingId);

                    const result = await migrateLecture(lecture, participants);
                    if (!result.migrated) {
                        failedLectures.push(lecture.zoomMeetingId);
                    } else {
                        migratedLectures.push(result.zoomMeetingId);
                    }
                } catch (error) {
                    failedLectures.push(lecture.zoomMeetingId);
                    const zoomError = error as ZoomError;

                    if (zoomError.status !== 404) {
                        logger.warn(`Error syncing lecture ${lecture.id} with Zoom: ${error.message}`, error);
                    }
                }
            })
        );

        logger.info(`Processed ${Math.min(i + CONCURRENCY, lectures.length)} / ${lectures.length}`);
    }

    logger.info(`Finished syncing ${lectures.length} lectures with Zoom.`);
    logger.info(`Migrated lectures: ${migratedLectures.length}`, { migratedLectures });
    logger.info(`Failed migrations: ${failedLectures.length}`, { failedLectures });
}

async function getParticipants(meetingId: string): Promise<ZoomMeetingReport['participants']> {
    const MAX_RETRIES = 10;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const response = await getPastZoomMeetingParticipants(meetingId);
        logger.debug(`Zoom API response status: ${response.status} for meeting ID: ${meetingId}`);
        if (response.status === 429) {
            const retryAfter = Number(response.headers?.get('Retry-After')) || 60;

            logger.warn(`Rate limit exceeded. Retrying after ${retryAfter}s.`);

            await sleep(retryAfter * 1000);
            continue;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new ZoomError(`Zoom returned ${response.status} ${error.message}`, response.status, error.code);
        }

        const participantsResponse = (await response.json()) as ZoomMeetingReport;
        return participantsResponse.participants;
    }
    throw new Error(`Failed to fetch participants for meeting ID: ${meetingId} after ${MAX_RETRIES} attempts.`);
}

async function migrateLecture(appointment: Appointment, participants: ZoomMeetingReport['participants']) {
    const pupilId = appointment.participantIds.find((id) => id.startsWith('pupil/'));
    const studentId = appointment.organizerIds.find((id) => id.startsWith('student/'));

    const sharedTime = getSharedMeetingTimeInSeconds(participants);

    if (!sharedTime) {
        logger.debug(`No shared time found for lecture ${appointment.id} for ZoomMeeting(${appointment.zoomMeetingId}). Skipping migration.`);
        return { zoomMeetingId: appointment.zoomMeetingId, migrated: false };
    }

    await prisma.lecture.update({
        where: { id: appointment.id },
        data: {
            actualDuration: Math.ceil(sharedTime / 60),
            joinedBy: { set: [studentId, pupilId] }, // At this point we know both joined, so we can set this field to reflect that.
        },
    });
    logger.debug(`Lecture ${appointment.id} migrated with actualDuration: ${Math.ceil(sharedTime / 60)} minutes.`);
    return { zoomMeetingId: appointment.zoomMeetingId, migrated: true };
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
