import { dissolve_reason, dissolved_by_enum, match as Match, pupil as Pupil, student as Student } from '@prisma/client';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { userForStudent, userForPupil, User } from '../user';
import { logTransaction } from '../transactionlog/log';
import { PrerequisiteError, RedundantError } from '../util/error';
import * as Notification from '../notification';
import { canRemoveZoomLicense, getMatchHash } from './util';
import { deleteZoomMeeting } from '../zoom/scheduled-meeting';
import { deleteZoomUser } from '../zoom/user';
import moment from 'moment';
import { invalidateAllScreeningsOfPupil } from '../pupil/screening';

const logger = getLogger('Match');

export async function dissolveMatch(
    match: Match,
    dissolveReasons: dissolve_reason[],
    dissolver: Pupil | Student | null,
    dissolvedBy: dissolved_by_enum,
    otherReason?: string
) {
    if (match.dissolved) {
        throw new RedundantError('The match was already dissolved');
    }

    if (dissolveReasons.length === 0) {
        throw new PrerequisiteError('Must specify at least one dissolve reason');
    }

    await prisma.match.update({
        where: { id: match.id },
        data: {
            dissolved: true,
            dissolveReasons: dissolveReasons,
            otherDissolveReason: otherReason,
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
    // by default, assume null is passed
    let dissolverUserForLog: User | null = dissolver as null;
    // now, let's trust on the dissolvedBy property to determine the right type for `dissolver`
    if (dissolver && dissolvedBy === 'pupil') {
        dissolverUserForLog = userForPupil(dissolver as Pupil);
    } else if (dissolver && dissolvedBy === 'student') {
        dissolverUserForLog = userForStudent(dissolver as Student);
    }

    await logTransaction('matchDissolve', dissolverUserForLog, {
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
    } else {
        await Notification.actionTaken(userForStudent(student), 'tutor_match_dissolved_mature', { pupil, matchHash, matchDate, uniqueId });
        await Notification.actionTaken(userForPupil(pupil), 'tutee_match_dissolved_mature', { student, matchHash, matchDate, uniqueId });
    }

    // If the student dissolved the match for personal issues or ghosting, invalidate all screenings of the pupil
    if ((dissolvedBy === dissolved_by_enum.student && dissolveReasons.includes('personalIssues')) || dissolveReasons.includes('ghosted')) {
        await invalidateAllScreeningsOfPupil(pupil.id);
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
        data: { dissolved: false, dissolveReasons: [], dissolvedAt: null },
        where: { id: match.id },
    });

    logger.info(`Match(${match.id}) was reactivated`);
}
