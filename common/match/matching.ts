import { pupil as Pupil, pupil_state_enum, student as Student, student_state_enum, gender_enum } from '@prisma/client';
import { maxWeightAssign } from 'munkres-algorithm';
import { getPupilGradeAsString } from '../pupil';
import { gradeAsInt } from '../util/gradestrings';
import { parseSubjectString } from '../util/subjectsutils';
import assert from 'assert';
import { prisma } from '../prisma';

// ------- The Matching Algorithm ------------
// For a series of match requests and match offers computes
// the perfect solution of the assignment problem

export type MatchRequest = Readonly<{
    pupil?: Pupil;
    pupilId: number;

    // Moved here from the pupil to decouple the matching algorithm
    // from the user representation
    grade: number;
    subjects: { name: string; mandatory?: boolean }[];
    state: pupil_state_enum;
    requestAt: Date;
    onlyMatchWith?: gender_enum;
    hasSpecialNeeds?: boolean;
}>;

export function pupilsToRequests(pupils: Pupil[]): MatchRequest[] {
    const result: MatchRequest[] = [];

    for (const pupil of pupils) {
        const request: MatchRequest = {
            pupil,
            pupilId: pupil.id,
            grade: gradeAsInt(pupil.grade),
            state: pupil.state,
            subjects: parseSubjectString(pupil.subjects),
            requestAt: pupil.firstMatchRequest,
            onlyMatchWith: pupil.onlyMatchWith,
            hasSpecialNeeds: pupil.hasSpecialNeeds,
        };

        for (let i = 0; i < pupil.openMatchRequestCount; i++) {
            result.push(request);
        }
    }

    return result;
}

export type MatchOffer = Readonly<{
    student?: Student;
    studentId: number;

    subjects: { name: string; grade?: { min: number; max: number } }[];
    state: student_state_enum;
    requestAt: Date;
    gender?: gender_enum;
    hasSpecialExperience?: boolean;
}>;

export function studentsToOffers(students: Student[]): MatchOffer[] {
    const result: MatchOffer[] = [];

    for (const student of students) {
        const offer: MatchOffer = {
            student,
            studentId: student.id,
            state: student.state,
            subjects: parseSubjectString(student.subjects),
            requestAt: student.firstMatchRequest,
            gender: student.gender,
            hasSpecialExperience: student.hasSpecialExperience,
        };

        for (let i = 0; i < student.openMatchRequestCount; i++) {
            result.push(offer);
        }
    }

    return result;
}

export type Matching = { request: MatchRequest; offer: MatchOffer }[];

// ------------ Match Exclusions ---------
// Find existing matches in the database which should be excluded from being matched again
export async function getMatchExclusions(requests: MatchRequest[], offers: MatchOffer[]) {
    const matches = await prisma.match.findMany({
        where: {
            OR: [{ pupilId: { in: requests.map((it) => it.pupilId) } }, { studentId: { in: offers.map((it) => it.studentId) } }],
        },
        select: { pupilId: true, studentId: true },
    });

    return new Set<string>(matches.map((it) => `${it.pupilId}/${it.studentId}`));
}

// ------------ Score ------------
// A score that is better the better the request fits to the offer,
// and -Infinity if it shall not be matched
export const NO_MATCH = -Infinity;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// value -> (0, 1), 0.5 if value = 0
function sigmoid(value: number) {
    return 1 / (1 + Math.E ** -value);
}

export function matchScore(request: MatchRequest, offer: MatchOffer, currentDate = new Date()): number {
    // ---------- Constraints -----------
    // If there is a gender constraint, only match helpers whose gender is known and matches
    if (request.onlyMatchWith && (!offer.gender || request.onlyMatchWith !== offer.gender)) {
        return NO_MATCH;
    }

    // Only match "special needs" with "special experience"
    if (request.hasSpecialNeeds && !offer.hasSpecialExperience) {
        return NO_MATCH;
    }

    // ---------- Subjects --------------

    let matchingSubjects = 0;

    for (const requestSubject of request.subjects) {
        let found = false;
        for (const offerSubject of offer.subjects) {
            if (requestSubject.name !== offerSubject.name) {
                continue;
            }

            const gradeFits = offerSubject.grade.min <= request.grade && request.grade <= offerSubject.grade.max;
            if (!gradeFits) {
                continue;
            }

            found = true;
            matchingSubjects += 1;
            break;
        }

        if (!found && requestSubject.mandatory) {
            // Mandatory Subject not fulfilled, match not possible
            return NO_MATCH;
        }
    }

    // At least some subjects need to match
    if (matchingSubjects === 0) {
        return NO_MATCH;
    }

    const subjectBonus = sigmoid((matchingSubjects - 1) * 2);

    // Add a small bonus if the state matches
    // As the probability of a state match is relatively high (about 1/16),
    //  just adding a small bonus is enough to achieve this for 30% of matches
    const stateBonus = offer.state === request.state ? 1 : 0;

    const offerWaitDays = (+currentDate - +offer.requestAt) / MS_PER_DAY;
    const offerWaitingBonus = offerWaitDays > 20 ? sigmoid(offerWaitDays - 20) : 0;

    // how good a match is in (0, 1)
    const score = 0.8 * subjectBonus /* + 0.02 * stateBonus + */ + 0.2 * offerWaitingBonus;

    // TODO: Fix retention for matches with only few subjects (e.g. both helper and helpee only have math as subject)
    // in that case the score is not so high, and thus they are retained for a long time, although the match is perfect

    // Retention: Do not directly match not so perfect matches,
    //  but let them wait for a few days, maybe a better match arrives
    /* const requestWaitDays = (+currentDate - +request.requestAt) / MS_PER_DAY;

    // Keep them at most for 3 weeks, and linearily increase the chance of getting matched
    const doRetention = requestWaitDays < 21;
    if (doRetention && score < 1 - requestWaitDays / 40) {
        return NO_MATCH;
    } */

    return score;
}

// ----------- Matching -------------
// Computes an optimal assignment according to the scores between
// all requests and offers
//
// excludeMatchings: Set of "pupilId/studentId"
export function computeMatchings(
    requests: MatchRequest[],
    offers: MatchOffer[],
    excludeMatchings: ReadonlySet<string> = new Set(),
    currentDate: Date = new Date()
): Matching {
    // Adjacency Matrix for Scores between Requests and Offers:
    //          Requests -->
    //              0     1      2      3
    //  Offers  0   -     10     -      -
    //    |     1   10    -      -      -
    //    v     2   20    -      -      -
    //
    // "No Match possible" is represented as -Infinity (as we do maximum weight assignment)
    const scores = new Float32Array(offers.length * requests.length);

    let debug = 'Input:\n';
    for (const [requestID, request] of requests.entries()) {
        for (const [offerID, offer] of offers.entries()) {
            // Exclude pupil / student combinations that were already matched before
            const matchId = `${request.pupilId}/${offer.studentId}`;
            const isAllowed = !excludeMatchings.has(matchId);

            const score = isAllowed ? matchScore(request, offer, currentDate) : -Infinity;
            scores[offerID + offers.length * requestID] = score;
            debug += ` - request ${requestID}, offer ${offerID}: ${score}\n`;
        }
    }

    // Runs the Kuhn-Munkres ("Hungarian") algorithm to find the best assignment
    // - this is equivalent to solving the weighted matching problem in a bipartite graph
    const { assignments } = maxWeightAssign({
        data: scores,
        shape: [requests.length, offers.length],
    });

    const matching: Matching = [];

    const excludeDuplicateAssignments = new Set<string>();

    debug += '\nOutput:\n';
    for (const [requestID, offerID] of assignments.entries()) {
        if (offerID === null) {
            continue;
        }

        const request = requests[requestID];
        const offer = offers[offerID];
        const matchId = `${request.pupilId}/${offer.studentId}`;

        assert(!excludeMatchings.has(matchId));

        // If a pupil has to requests and a student has two offers,
        // prevent them from being matched twice
        if (excludeDuplicateAssignments.has(matchId)) {
            continue;
        }
        excludeDuplicateAssignments.add(matchId);

        debug += ` - request: ${requestID}, offer: ${offerID}\n`;

        matching.push({
            request: requests[requestID],
            offer: offers[offerID],
        });
    }

    // console.log(debug);

    return matching;
}
