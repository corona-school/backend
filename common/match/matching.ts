import { pupil as Pupil, pupil_state_enum, student as Student, student_state_enum } from '@prisma/client';
import { maxWeightAssign } from 'munkres-algorithm';
import { getPupilGradeAsString } from '../pupil';
import { gradeAsInt } from '../util/gradestrings';
import { parseSubjectString } from '../util/subjectsutils';

// ------- The Matching Algorithm ------------
// For a series of match requests and match offers computes
// the perfect solution of the assignment problem

export type MatchRequest = Readonly<{
    pupil?: Pupil;

    // Moved here from the pupil to decouple the matching algorithm
    // from the user representation
    grade: number;
    subjects: { name: string; mandatory?: boolean }[];
    state: pupil_state_enum;
    requestAt: Date;
}>;

export function pupilsToRequests(pupils: Pupil[]): MatchRequest[] {
    const result: MatchRequest[] = [];

    for (const pupil of pupils) {
        const request: MatchRequest = {
            pupil,
            grade: gradeAsInt(pupil.grade),
            state: pupil.state,
            subjects: parseSubjectString(pupil.subjects),
            requestAt: pupil.firstMatchRequest,
        };

        for (let i = 0; i < pupil.openMatchRequestCount; i++) {
            result.push(request);
        }
    }

    return result;
}

export type MatchOffer = Readonly<{
    student?: Student;

    subjects: { name: string; grade?: { min: number; max: number } }[];
    state: student_state_enum;
    requestAt: Date;
}>;

export function studentsToOffers(students: Student[]): MatchOffer[] {
    const result: MatchOffer[] = [];

    for (const student of students) {
        const offer: MatchOffer = {
            student,
            state: student.state,
            subjects: parseSubjectString(student.subjects),
            requestAt: student.firstMatchRequest,
        };

        for (let i = 0; i < student.openMatchRequestCount; i++) {
            result.push(offer);
        }
    }

    return result;
}

export type Matching = { request: MatchRequest; offer: MatchOffer }[];

// ------------ Score ------------
// A score that is better the better the request fits to the offer,
// and -Infinity if it shall not be matched
export const NO_MATCH = -Infinity;

export function matchScore(request: MatchRequest, offer: MatchOffer): number {
    // ---------- Subjects --------------

    let subjectScore = 0;

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
            subjectScore += 1;
            break;
        }

        if (!found && requestSubject.mandatory) {
            // Mandatory Subject not fulfilled, match not possible
            return NO_MATCH;
        }
    }

    // At least some subjects need to match
    if (subjectScore === 0) {
        return NO_MATCH;
    }

    // TODO: State + Language + ...

    return subjectScore;
}

// ----------- Matching -------------
// Computes an optimal assignment according to the scores between
// all requests and offers
export function computeMatchings(requests: MatchRequest[], offers: MatchOffer[]): Matching {
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
            const score = matchScore(request, offer);
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

    debug += '\nOutput:\n';
    for (const [requestID, offerID] of assignments.entries()) {
        if (offerID === null) {
            continue;
        }

        debug += ` - request: ${requestID}, offer: ${offerID}\n`;

        matching.push({
            request: requests[requestID],
            offer: offers[offerID],
        });
    }

    // console.log(debug);

    return matching;
}
