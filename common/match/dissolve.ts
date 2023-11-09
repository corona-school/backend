import { dissolve_reason, dissolved_by_enum, match as Match, pupil as Pupil, student as Student } from '@prisma/client';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { userForStudent, userForPupil } from '../user';
import { logTransaction } from '../transactionlog/log';
// eslint-disable-next-line camelcase
import { Project_match } from '../../graphql/generated';
import { RedundantError } from '../util/error';
import * as Notification from '../notification';
import { canRemoveZoomLicense, getMatchHash } from './util';
import { deleteZoomMeeting } from '../zoom/scheduled-meeting';
import { deleteZoomUser } from '../zoom/user';
import moment from 'moment';

const logger = getLogger('Match');

export async function dissolveMatch(match: Match, dissolveReason: dissolve_reason, dissolver: Pupil | Student | null, dissolvedBy: dissolved_by_enum) {
    if (match.dissolved) {
        throw new RedundantError('The match was already dissolved');
    }

    await prisma.match.update({
        where: { id: match.id },
        data: {
            dissolved: true,
            dissolveReasonEnum: dissolveReason,
            dissolvedAt: new Date(),
            dissolvedBy,
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

    if ((await canRemoveZoomLicense(match.studentId)) && student.zoomUserId) {
        await deleteZoomUser(student);
    }
    await Notification.actionTaken(userForStudent(student), 'tutor_match_dissolved', { pupil, matchHash, matchDate, uniqueId });
    await Notification.actionTaken(userForPupil(pupil), 'tutee_match_dissolved', { student, matchHash, matchDate, uniqueId });

    if (new Date() < moment(match.createdAt).add(30, 'days').toDate()) {
        await Notification.actionTaken(userForStudent(student), 'tutor_match_dissolved_quickly', { pupil, matchHash, matchDate, uniqueId });
        await Notification.actionTaken(userForPupil(pupil), 'tutee_match_dissolved_quickly', { student, matchHash, matchDate, uniqueId });
    }

    if (dissolver && dissolver.email === student.email) {
        await Notification.actionTaken(userForPupil(pupil), 'tutee_match_dissolved_other', { student, matchHash, matchDate, uniqueId });
    } else if (dissolver && dissolver.email === pupil.email) {
        await Notification.actionTaken(userForStudent(student), 'tutor_match_dissolved_other', { pupil, matchHash, matchDate, uniqueId });
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
