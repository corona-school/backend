import { pupil as Pupil, student as Student, pupil_registrationsource_enum as RegistrationSource } from '@prisma/client';
import { getLogger } from '../../common/logger/logger';
import { prisma } from '../prisma';
import { assertAllowed, Decision } from '../util/decision';
import { PrerequisiteError, RedundantError } from '../util/error';
import { invalidateAllScreeningsOfPupil } from '../pupil/screening';
import * as Notification from '../notification';
import { userForPupil, userForStudent } from '../user';
import moment from 'moment';
import { parseSubjectString } from '../util/subjectsutils';
import { isDev } from '../util/environment';

const logger = getLogger('Match');

const PUPIL_MAX_REQUESTS = 1;
const STUDENT_MAX_REQUESTS = 3;
const PUPIL_MAX_MATCHES = 1;

type RequestBlockReasons = 'not-tutee' | 'not-tutor' | 'not-screened' | 'no-subjects-selected' | 'max-requests' | 'max-matches' | 'max-dissolved-matches';

export async function canPupilRequestMatch(pupil: Pupil): Promise<Decision<RequestBlockReasons>> {
    // Business Rules as outlined in https://github.com/corona-school/project-user/issues/404

    const isTestUserOnProd = !isDev && pupil.email.startsWith('test+prod') && pupil.email.endsWith('@lern-fair.de');
    const openMatchRequestCount = await prisma.match_request.count({ where: { pupilId: pupil.id, status: 'open' } });
    if (!pupil.isPupil) {
        return { allowed: false, reason: 'not-tutee' };
    }

    if (openMatchRequestCount >= PUPIL_MAX_REQUESTS) {
        return { allowed: false, reason: 'max-requests', limit: PUPIL_MAX_REQUESTS };
    }

    if (!parseSubjectString(pupil.subjects).length) {
        return { allowed: false, reason: 'no-subjects-selected' };
    }

    if (pupil.registrationSource === '' + RegistrationSource.cooperation) {
        return { allowed: true };
    }

    const activeMatchCount = await prisma.match.count({ where: { pupilId: pupil.id, dissolved: false } });

    const getMaxMatchesForUser = () => {
        // Test users on production are allowed to have 2 active matches for testing purposes
        if (isTestUserOnProd) {
            return PUPIL_MAX_MATCHES + 1;
        }
        return PUPIL_MAX_MATCHES;
    };
    if (openMatchRequestCount + activeMatchCount >= getMaxMatchesForUser()) {
        return { allowed: false, reason: 'max-matches', limit: PUPIL_MAX_MATCHES };
    }

    // previously we also had max-dissolved-matches - this was removed a long time ago

    return { allowed: true };
}

export async function createPupilMatchRequest(pupil: Pupil, adminOverride = false) {
    if (!adminOverride) {
        assertAllowed(await canPupilRequestMatch(pupil));
    }
    if (!parseSubjectString(pupil.subjects).length) {
        throw new PrerequisiteError('Subjects must be selected before creating a match request');
    }

    const request = await prisma.match_request.create({ data: { pupilId: pupil.id, subjects: parseSubjectString(pupil.subjects) } });

    await Notification.actionTaken(userForPupil(pupil), 'tutee_match_requested', {});

    // Invalidation doesn't apply when admins/screeners are creating the match request
    if (!adminOverride) {
        const hasActiveMatch = (await prisma.match.count({ where: { pupilId: pupil.id, dissolved: false } })) > 0;

        const screeningInTheLastFourMonths = await prisma.pupil_screening.findFirst({
            where: {
                pupilId: pupil.id,
                status: 'success',
                invalidated: false,
                createdAt: {
                    gte: moment().subtract(4, 'months').toDate(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        // If the last successful screening, wasn't in the last four months.
        // OR if the user is requesting a second match, then invalidate all the screenings.
        if (!screeningInTheLastFourMonths || hasActiveMatch) {
            await invalidateAllScreeningsOfPupil(pupil.id);
        }
    }

    logger.info(`Created MatchRequest(${request.id}) for Pupil(${pupil.id}). Was admin: ${adminOverride}`);
    return request;
}

export async function deletePupilMatchRequest(id: number) {
    const openMatchRequest = await prisma.match_request.findFirst({ where: { id, status: 'open', pupilId: { not: null } } });
    if (!openMatchRequest) {
        throw new RedundantError(`Cannot delete MatchRequest(${id}) as it is not open or does not exist`);
    }

    const result = await prisma.match_request.update({
        where: { id },
        data: { status: 'cancelled', closedAt: new Date() },
    });

    if (result.status === 'cancelled') {
        const pupil = await prisma.pupil.findUnique({ where: { id: result.pupilId! } });
        await Notification.actionTaken(userForPupil(pupil), 'tutee_match_request_revoked', {});
    }

    logger.info(`Deleted MatchRequest(${id}) for Pupil(${result.pupilId})`);
}

export async function canStudentRequestMatch(student: Student): Promise<Decision<RequestBlockReasons>> {
    if (!student.isStudent) {
        return { allowed: false, reason: 'not-tutor' };
    }

    const wasScreened = (await prisma.screening.count({ where: { studentId: student.id, status: 'success' } })) > 0;
    if (!wasScreened) {
        return { allowed: false, reason: 'not-screened' };
    }

    const openMatchRequestCount = await prisma.match_request.count({ where: { studentId: student.id, status: 'open' } });
    if (openMatchRequestCount >= STUDENT_MAX_REQUESTS) {
        return { allowed: false, reason: 'max-requests', limit: STUDENT_MAX_REQUESTS };
    }

    return { allowed: true };
}

export async function createStudentMatchRequest(student: Student, adminOverride = false) {
    if (!adminOverride) {
        assertAllowed(await canStudentRequestMatch(student));
    }
    const request = await prisma.match_request.create({ data: { studentId: student.id, subjects: parseSubjectString(student.subjects) } });

    await Notification.actionTaken(userForStudent(student), 'tutor_match_requested', {});

    logger.info(`Created MatchRequest(${request.id}) for Student(${student.id}). Was admin: ${adminOverride}`);
    return request;
}

export async function deleteStudentMatchRequest(id: number) {
    const openMatchRequest = await prisma.match_request.findFirst({ where: { id, status: 'open', studentId: { not: null } } });
    if (!openMatchRequest) {
        throw new RedundantError(`Cannot delete MatchRequest(${id}) as it is not open or does not exist`);
    }

    const result = await prisma.match_request.update({
        where: { id },
        data: { status: 'cancelled', closedAt: new Date() },
    });

    if (result.status === 'cancelled') {
        const student = await prisma.student.findUnique({ where: { id: result.studentId! } });
        await Notification.actionTaken(userForStudent(student), 'tutor_match_request_revoked', {});
    }

    logger.info(`Deleted MatchRequest(${id}) for Student(${result.studentId})`);
}
