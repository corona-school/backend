import { match as Match, pupil as Pupil, student as Student } from '@prisma/client';
import { sendTemplateMail, mailjetTemplates } from '../mails';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { isStudent, isPupil } from '../user';
import { logTransaction } from '../transactionlog/log';
// eslint-disable-next-line camelcase
import { Project_match } from '../../graphql/generated';
import { RedundantError } from '../util/error';
import * as Notification from '../notification';
import { getMatchHash } from './util';
import { deleteZoomMeeting } from '../zoom/zoom-scheduled-meeting';

const logger = getLogger('Match');

export async function dissolveMatch(match: Match, dissolveReason: number, dissolver: Pupil | Student | null) {
    if (match.dissolved) {
        throw new RedundantError('The match was already dissolved');
    }

    await prisma.match.update({
        where: { id: match.id },
        data: {
            dissolved: true,
            dissolveReason,
        },
    });
    const matchLectures = await prisma.lecture.findMany({
        where: {
            matchId: match.id,
        },
    });
    for (const lecture of matchLectures) {
        if (lecture.zoomMeetingId) {
            await deleteZoomMeeting(lecture);
        }
    }

    await logTransaction('matchDissolve', dissolver, {
        matchId: match.id,
    });

    logger.info(`Match(${match.id}) was dissolved by ${dissolver?.firstname ?? 'an admin'}`);

    const student = await prisma.student.findUnique({ where: { id: match.studentId } });
    const pupil = await prisma.pupil.findUnique({ where: { id: match.pupilId } });
    const matchHash = getMatchHash(match);
    const matchDate = '' + +match.createdAt;
    const uniqueId = '' + match.id;

    await Notification.actionTaken(student, 'tutor_match_dissolved', { pupil, matchHash, matchDate, uniqueId });
    await Notification.actionTaken(pupil, 'tutee_match_dissolved', { student, matchHash, matchDate, uniqueId });

    if (dissolver && dissolver.email === student.email) {
        await Notification.actionTaken(pupil, 'tutee_match_dissolved_other', { student, matchHash, matchDate, uniqueId });
    } else if (dissolver && dissolver.email === pupil.email) {
        await Notification.actionTaken(student, 'tutor_match_dissolved_other', { pupil, matchHash, matchDate, uniqueId });
    }
}

export async function reactivateMatch(match: Match) {
    if (!match.dissolved) {
        throw new RedundantError(`Match was already reactivated`);
    }

    await prisma.match.update({
        data: { dissolved: false, dissolveReason: null, dissolvedAt: null },
        where: { id: match.id },
    });

    logger.info(`Match(${match.id}) was reactivated`);
}
