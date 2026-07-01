import { prisma } from '../../common/prisma';
import { lecture as Appointment } from '@prisma/client';
import { getPastZoomMeetingParticipants, ZoomMeetingReport } from '../../common/zoom/scheduled-meeting';
import { getLogger } from '../../common/logger/logger';
import { ZoomError } from '../../common/util/error';
import { getSharedMeetingTimeInSeconds } from '../../common/zoom/util';

const logger = getLogger('SyncOldMatchLecturesWithZoom');
const CONCURRENCY = 5;

type LectureChunk = Pick<Appointment, 'id' | 'participantIds' | 'organizerIds' | 'start' | 'zoomMeetingId'>;

type Result = {
    migratedLectures: string[];
    notFoundLectures: string[];
    foundButNotMigratedLectures: string[];
};

export async function syncOldMatchLecturesWithZoom(): Promise<void> {
    const migrationResult: Result = {
        migratedLectures: [],
        notFoundLectures: [],
        foundButNotMigratedLectures: [],
    };
    let processedLectures = 0;
    let lastLectureCursor: LectureChunk | null = null;
    let chunk = await getLectureChunk(lastLectureCursor);

    while (chunk.length > 0) {
        await Promise.all(
            chunk.map(async (lecture) => {
                try {
                    const participants = await getParticipants(lecture.zoomMeetingId);

                    const result = await migrateLecture(lecture, participants);
                    if (!result.migrated) {
                        migrationResult.foundButNotMigratedLectures.push(lecture.zoomMeetingId);
                    } else {
                        migrationResult.migratedLectures.push(result.zoomMeetingId);
                    }
                } catch (error) {
                    migrationResult.notFoundLectures.push(lecture.zoomMeetingId);
                    const zoomError = error as ZoomError;

                    if (zoomError.status !== 404) {
                        logger.warn(`Error syncing lecture ${lecture.id} with Zoom: ${error.message}`, error);
                    }
                }
            })
        );

        processedLectures += chunk.length;
        lastLectureCursor = chunk[chunk.length - 1];
        logger.info(`Processed ${processedLectures} lectures so far.`);
        chunk = await getLectureChunk(lastLectureCursor);
    }

    logger.info(`Finished syncing ${processedLectures} lectures with Zoom.`);
    logger.info(`Migrated lectures: ${migrationResult.migratedLectures.length}`, { migratedLectures: migrationResult.migratedLectures });
    logger.info(`Not found lectures: ${migrationResult.notFoundLectures.length}`, { notFoundLectures: migrationResult.notFoundLectures });
    logger.info(`Found but not migrated lectures: ${migrationResult.foundButNotMigratedLectures.length}`, {
        foundButNotMigratedLectures: migrationResult.foundButNotMigratedLectures,
    });
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

async function getLectureChunk(lastLectureCursor: LectureChunk | null): Promise<LectureChunk[]> {
    return (await prisma.$queryRaw`
        SELECT lecture."id", lecture."zoomMeetingId", lecture."participantIds", lecture."organizerIds", lecture."start"
        FROM lecture
        INNER JOIN match ON match.id = lecture."matchId"
        INNER JOIN student ON student.id = match."studentId"
        WHERE lecture."createdAt" >= '2025-05-01'
            AND lecture."isCanceled" IS FALSE
            AND lecture."appointmentType" = 'match'
            AND lecture."zoomMeetingId" IS NOT NULL
            AND array_length(lecture."declinedBy", 1) IS NULL
            AND array_length(lecture."joinedBy", 1) = 1
            AND student."zoomUserId" IS NOT NULL
            AND lecture."actualDuration" = 0
            AND (
                ${lastLectureCursor === null}
                OR lecture."start" > ${lastLectureCursor?.start ?? null}
                OR (lecture."start" = ${lastLectureCursor?.start ?? null} AND lecture."id" > ${lastLectureCursor?.id ?? null})
            )
        ORDER BY lecture."start" ASC, lecture."id" ASC
        LIMIT ${CONCURRENCY}
    `) as LectureChunk[];
}

async function migrateLecture(appointment: LectureChunk, participants: ZoomMeetingReport['participants']) {
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
