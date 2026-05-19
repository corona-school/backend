import { student as Student, pupil as Pupil, match as Match, match_request as MatchRequest } from '@prisma/client';
import { prisma } from '../prisma';
import { v4 as generateUUID } from 'uuid';
import { getPupilGradeAsString } from '../pupil';
import * as Notification from '../notification';
import { removeInterest } from './interest';
import { getJitsiTutoringLink, getMatchHash, getOverlappingSubjects } from './util';
import { getLogger } from '../../common/logger/logger';
import { PrerequisiteError } from '../util/error';
import type { ConcreteMatchPool } from './pool';
import { userForPupil, userForStudent } from '../user';
import { DAZ } from '../util/subjectsutils';
import { gradeAsInt } from '../util/gradestrings';
import { createMatchConversation } from '../chat/create';

const logger = getLogger('Match');

interface CreateMatchOptions {
    skipChatCreation?: boolean;
}

export async function createMatch(
    request: MatchRequest,
    offer: MatchRequest,
    pool: ConcreteMatchPool,
    options: CreateMatchOptions = { skipChatCreation: false }
): Promise<Match> {
    const uuid = generateUUID();
    const freshRequest = await prisma.match_request.findUniqueOrThrow({ where: { id: request.id }, include: { pupil: true } });
    const freshOffer = await prisma.match_request.findUniqueOrThrow({ where: { id: offer.id }, include: { student: true } });

    if (freshRequest.status !== 'open') {
        throw new PrerequisiteError(`Cannot create Match for MatchRequest(${request.id}) with status ${freshRequest.status}`);
    }

    if (freshOffer.status !== 'open') {
        throw new PrerequisiteError(`Cannot create Match for MatchOffer(${offer.id}) with status ${freshOffer.status}`);
    }

    const pupil = freshRequest.pupil;
    const student = freshOffer.student;

    const overlappingSubjects = getOverlappingSubjects(pupil, student);
    const pupilGrade = pupil.grade ?? gradeAsInt(pupil.grade);

    const match = await prisma.match.create({
        data: {
            uuid,
            pupilId: pupil.id,
            studentId: student.id,
            pupilFirstMatchRequest: pupil.firstMatchRequest,
            studentFirstMatchRequest: student.firstMatchRequest,
            matchPool: pool.name,
            matchPoolRunId: null,
            subjectsAtMatchingTime: overlappingSubjects.map((subject) => ({
                name: subject.name,
                minGrade: subject.grade?.min,
                maxGrade: subject.grade?.max,
                pupilGrade: pupilGrade,
                mandatory: !!subject.mandatory,
            })),
        },
    });

    await prisma.match_request.update({
        where: { id: freshRequest.id },
        data: { status: 'resolved', matchId: match.id },
    });

    await prisma.match_request.update({
        where: { id: freshOffer.id },
        data: { status: 'resolved', matchId: match.id },
    });

    await removeInterest(pupil);

    const callURL = getJitsiTutoringLink(match);
    const subjects = overlappingSubjects.map((it) => it.name);

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
    if (!options?.skipChatCreation) {
        await createMatchConversation(match.id);
    }

    return match;
}
