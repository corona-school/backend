import { student as Student, pupil as Pupil } from '@prisma/client';
import { prisma } from '../prisma';
import { v4 as generateUUID } from 'uuid';
import { getPupilGradeAsString } from '../pupil';
import * as Notification from '../notification';
import { removeInterest } from './interest';
import { getJitsiTutoringLink, getMatchHash, getOverlappingSubjects } from './util';
import { getLogger } from '../../common/logger/logger';
import { PrerequisiteError } from '../util/error';
import type { ConcreteMatchPool } from './pool';
import { invalidateAllScreeningsOfPupil } from '../pupil/screening';
import { userForPupil, userForStudent } from '../user';
import { DAZ } from '../util/subjectsutils';

const logger = getLogger('Match');

export async function createMatch(pupil: Pupil, student: Student, pool: ConcreteMatchPool) {
    const uuid = generateUUID();

    // Refetch match request count to reduce the likelihood of race conditions
    // (does not prevent it though, we would actually need a SELECT FOR UPDATE)
    const freshPupil = await prisma.pupil.findUniqueOrThrow({ where: { id: pupil.id }, select: { openMatchRequestCount: true } });
    const freshStudent = await prisma.student.findUniqueOrThrow({ where: { id: student.id }, select: { openMatchRequestCount: true } });

    if (freshPupil.openMatchRequestCount < 1) {
        throw new PrerequisiteError(`Cannot create Match for Pupil without open match requests`);
    }

    if (freshStudent.openMatchRequestCount < 1) {
        throw new PrerequisiteError(`Cannot create Match for Student without open match request count`);
    }

    const match = await prisma.match.create({
        data: {
            uuid,
            pupilId: pupil.id,
            studentId: student.id,
            pupilFirstMatchRequest: pupil.firstMatchRequest,
            studentFirstMatchRequest: student.firstMatchRequest,
            matchPool: pool.name,
        },
    });

    await prisma.pupil.update({
        where: { id: pupil.id },
        data: {
            openMatchRequestCount: { decrement: 1 },
        },
    });

    await prisma.student.update({
        where: { id: student.id },
        data: {
            openMatchRequestCount: { decrement: 1 },
        },
    });

    await invalidateAllScreeningsOfPupil(pupil.id);
    await removeInterest(pupil);

    const callURL = getJitsiTutoringLink(match);
    const subjects = getOverlappingSubjects(pupil, student).map((it) => it.name);

    const matchSubjects = subjects.join('/');

    const tutorFirstMatch = (await prisma.match.count({ where: { studentId: student.id } })) === 1;
    const tuteeFirstMatch = (await prisma.match.count({ where: { pupilId: pupil.id } })) === 1;

    const matchHash = getMatchHash(match);
    // NOTE: JSON numbers which are larger than 32 bit integers crash mailjet internally, so strings need to be used here
    const matchDate = '' + +match.createdAt;

    const tutorContext = {
        uniqueId: '' + match.id,
        pupil,
        pupilGrade: getPupilGradeAsString(pupil),
        matchSubjects,
        callURL,
        firstMatch: tutorFirstMatch,
        matchHash,
        matchDate,
    };

    await Notification.actionTaken(userForStudent(student), `tutor_matching_success`, tutorContext);

    await Notification.actionTaken(
        userForStudent(student),
        subjects.includes(DAZ) ? 'tutor_daz_matching_success' : 'tutor_standard_matching_success',
        tutorContext
    );

    await Notification.actionTaken(userForStudent(student), `tutor_matching_${pool.name}`, tutorContext);

    const tuteeContext = {
        uniqueId: '' + match.id,
        student,
        matchSubjects,
        callURL,
        firstMatch: tuteeFirstMatch,
        matchHash,
        matchDate,
    };

    await Notification.actionTaken(userForPupil(pupil), `tutee_matching_${pool.name}`, tuteeContext);
    await Notification.actionTaken(userForPupil(pupil), 'tutee_matching_success', tuteeContext);

    logger.info(`Created Match(${match.uuid}) for Student(${student.id}) and Pupil(${pupil.id})`);

    return match;
}
