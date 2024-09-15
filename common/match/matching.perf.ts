import { readFileSync } from 'fs';
import { computeMatchings, Matching, MatchOffer, MatchRequest } from './matching';
import { parseSubjectString } from '../util/subjectsutils';
import { pupil_state_enum, student_state_enum } from '@prisma/client';
import assert from 'assert';
import { formattedSubjectToSubjectWithGradeRestriction } from './util';
import { gradeAsInt } from '../util/gradestrings';

/* Export from all pupils and students that were in a match till 14.09.2024
   (since we started recording match request dates)

SELECT "student"."id", "student"."subjects", "student"."state", "match"."studentFirstMatchRequest" AS "requestAt" FROM "student"
  INNER JOIN "match" ON "match"."studentId" = "student"."id"
  WHERE "match"."studentFirstMatchRequest" IS NOT NULL
  ORDER BY "match"."studentFirstMatchRequest" ASC;

SELECT "pupil"."id", "pupil"."subjects", "pupil"."state", "pupil"."grade", "match"."pupilFirstMatchRequest" AS "requestAt" FROM "pupil"
  INNER JOIN "match" ON "match"."pupilId" = "pupil"."id"
  WHERE "match"."pupilFirstMatchRequest" IS NOT NULL
  ORDER BY "match"."pupilFirstMatchRequest" ASC;
*/
interface HistoryEntry {
    id: number;
    requestAt: string;
    subjects: string;
    state: pupil_state_enum | student_state_enum;
    grade?: string;
}

const pupils = JSON.parse(readFileSync(__dirname + '/matching.perf.pupil.json', { encoding: 'utf-8' })) as HistoryEntry[];
const students = JSON.parse(readFileSync(__dirname + '/matching.perf.student.json', { encoding: 'utf-8' })) as HistoryEntry[];

async function computeOldMatchings(
    requests: MatchRequest[],
    offers: MatchOffer[],
    matchesPerPupil: { [pupilId: string]: string[] },
    matchesPerStudent: { [studentId: string]: string[] }
) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { match } = await import('corona-school-matching');

    const helperByUUID = new Map();
    const helpeeByUUID = new Map();
    const requestByUUID = new Map();
    const offerByUUID = new Map();

    for (const request of requests) {
        const uuid = `${request.pupilId}`;
        if (helpeeByUUID.has(uuid)) {
            helpeeByUUID.get(uuid).matchRequestCount += 1;
        } else {
            requestByUUID.set(uuid, request);
            helpeeByUUID.set(uuid, {
                id: request.pupilId,
                uuid,
                matchRequestCount: 1,
                subjects: request.subjects.map(formattedSubjectToSubjectWithGradeRestriction),
                createdAt: request.requestAt,
                excludeMatchesWith: (matchesPerPupil[uuid] ?? []).map((uuid) => ({ uuid })),
                state: request.state,
                grade: request.grade,
                matchingPriority: 1,
                // firstMatchRequest: student.firstMatchRequest
            });
        }
    }

    for (const offer of offers) {
        const uuid = `${offer.studentId}`;
        if (helperByUUID.has(uuid)) {
            helperByUUID.get(uuid).matchRequestCount += 1;
        } else {
            offerByUUID.set(uuid, offer);
            helperByUUID.set(uuid, {
                id: offer.studentId,
                uuid,
                matchRequestCount: 1,
                subjects: offer.subjects,
                createdAt: offer.requestAt,
                excludeMatchesWith: (matchesPerStudent[uuid] ?? []).map((uuid) => ({ uuid })),
                state: offer.state,
                // firstMatchRequest: student.firstMatchRequest
            });
        }
    }

    const result = match([...helperByUUID.values()], [...helpeeByUUID.values()], {
        balancingCoefficients: {
            subjectMatching: 0.65,
            state: 0.05,
            waitingTime: 0.2,
            matchingPriority: 0.1,
        },
    });

    const matching: Matching = result.matches.map((it) => ({
        request: requestByUUID.get(it.helpee.uuid),
        offer: offerByUUID.get(it.helper.uuid),
    }));

    return matching;
}

describe('Real World Matching Performance', () => {
    test.each([
        // New Algorithm
        [
            'new',
            1000,
            {
                matchCountSum: 992,
                matchCountAvg: 992,
                matchingSubjectsSum: 1928,
                matchingSubjectsAvg: 1.9435483870967742,
                matchingState: 104,
                pupilWaitingTimeAvg: 265.13938902154763,
                studentWaitingTimeAvg: 307.9948034227647,
                matchRuns: 1,
            },
        ],
        [
            'new',
            10,
            {
                matchCountSum: 1045,
                matchCountAvg: 15.833333333333334,
                matchingSubjectsSum: 1782,
                matchingSubjectsAvg: 1.7052631578947368,
                matchingState: 111,
                pupilWaitingTimeAvg: 8.261916506434973,
                studentWaitingTimeAvg: 54.33950775279106,
                matchRuns: 66,
            },
        ],
        [
            'new',
            1,
            {
                matchCountSum: 1045,
                matchCountAvg: 2.4189814814814814,
                matchingSubjectsSum: 1732,
                matchingSubjectsAvg: 1.6574162679425837,
                matchingState: 127,
                pupilWaitingTimeAvg: 3.8739144757442903,
                studentWaitingTimeAvg: 49.6384115727672,
                matchRuns: 432,
            },
        ],
        // Old Algorithm
        // Interestingly the old algorithm is not deterministic
        // Also running it in the barrier does not make sense as it wont change anyways
        /* [
            'old',
            1000,
            {
                matchCountSum: 883,
                matchCountAvg: 441.5,
                matchingSubjectsSum: 1824,
                matchingSubjectsAvg: 2.0656851642129106,
                matchingState: 472,
                pupilWaitingTimeAvg: 283.9889498853212,
                studentWaitingTimeAvg: 399.3507213564743,
                matchRuns: 2,
            },
        ],
        [
            'old',
            10,
            {
                matchCountSum: 1023,
                matchCountAvg: 15.26865671641791,
                matchingSubjectsSum: 1843,
                matchingSubjectsAvg: 1.801564027370479,
                matchingState: 381,
                pupilWaitingTimeAvg: 7.3103790962831745,
                studentWaitingTimeAvg: 63.7282721143899,
                matchRuns: 67,
            },
        ],
        [
            'old',
            1,
            {
                matchCountSum: 1023,
                matchCountAvg: 2.3625866050808315,
                matchingSubjectsSum: 1778,
                matchingSubjectsAvg: 1.7380254154447703,
                matchingState: 341,
                pupilWaitingTimeAvg: 2.383032886243719,
                studentWaitingTimeAvg: 52.283081214712084,
                matchRuns: 433,
            },
        ], */
    ])('%s algorithm - Run every %s days', async (algo, runDays, expectedSummary) => {
        let log = '';
        let pupilIdx = 0,
            studentIdx = 0;
        const requestPool: MatchRequest[] = [],
            offerPool: MatchOffer[] = [];

        const pupilWaitingTime: number[] = [];
        const studentWaitingTime: number[] = [];
        const matchingSubjects: number[] = [];
        const matchCount: number[] = [];
        let matchingState = 0;

        const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
        const avg = (values: number[]) => sum(values) / (values.length || 1);

        let currentDate: Date;
        let matchRunDate: Date;
        let runtime = 0;
        let matchRuns = 0;

        // Duplicate tracking
        const matchIds = new Set<string>();
        const matchesPerPupil: { [pupilId: string]: string[] } = {};
        const matchesPerStudent: { [studentId: string]: string[] } = {};

        async function runMatching() {
            const start = performance.now();
            const runMatches =
                algo === 'new'
                    ? computeMatchings(requestPool, offerPool, matchIds)
                    : await computeOldMatchings(requestPool, offerPool, matchesPerPupil, matchesPerStudent);
            const duration = performance.now() - start;
            runtime += duration;
            matchRuns += 1;

            // log += `-> matched ${requestPool.length} requests and ${offerPool.length} offers to ${runMatches.length} matches in ${duration}ms\n`;

            matchCount.push(runMatches.length);
            for (const match of runMatches) {
                // --- Matches must be unique ---
                const matchId = `${match.request.pupilId}/${match.offer.studentId}`;
                expect(matchIds.has(matchId)).toBeFalsy();
                matchIds.add(matchId);
                (matchesPerPupil[`${match.request.pupilId}`] ??= []).push(`${match.offer.studentId}`);
                (matchesPerStudent[`${match.offer.studentId}`] ??= []).push(`${match.request.pupilId}`);

                // --- Track Statistics ---
                if (match.request.state === match.offer.state) {
                    matchingState += 1;
                }

                let subjectCount = 0;
                for (const requestSubject of match.request.subjects) {
                    let found = false;
                    for (const offerSubject of match.offer.subjects) {
                        if (offerSubject.name === requestSubject.name) {
                            subjectCount += 1;
                            found = true;
                            break;
                        }
                    }

                    /* TODO: if (requestSubject.mandatory) {
                        expect(found).toBeTruthy();
                    } */
                }

                matchingSubjects.push(subjectCount);
                studentWaitingTime.push((+currentDate - +match.offer.requestAt) / 1000 / 60 / 60 / 24);
                pupilWaitingTime.push((+currentDate - +match.request.requestAt) / 1000 / 60 / 60 / 24);

                // --- Remove match participants from pools ---
                requestPool.splice(requestPool.indexOf(match.request), 1);
                offerPool.splice(offerPool.indexOf(match.offer), 1);
            }

            matchRunDate = currentDate;
        }

        while (pupilIdx < pupils.length || studentIdx < students.length) {
            const pupil = pupils[pupilIdx];
            const student = students[studentIdx];

            // Joining the sorted pupil and student lists,
            //  so that they are added in order to the offer and request pools
            if (!student || pupil.requestAt < student.requestAt) {
                // For ISO dates string order = date order
                requestPool.push({
                    pupilId: pupil.id,
                    grade: gradeAsInt(pupil.grade!),
                    state: pupil.state,
                    subjects: parseSubjectString(pupil.subjects),
                    requestAt: new Date(pupil.requestAt),
                });
                pupilIdx += 1;
                // log += `  + ${pupil.requestAt} - add pupil\n`;
                currentDate = new Date(pupil.requestAt);
            } else {
                assert(student);
                offerPool.push({
                    studentId: student.id,
                    state: student.state,
                    subjects: parseSubjectString(student.subjects),
                    requestAt: new Date(student.requestAt),
                });
                studentIdx += 1;
                // log += `  + ${student.requestAt} - add student\n`;
                currentDate = new Date(student.requestAt);
            }

            if (!matchRunDate) {
                matchRunDate = currentDate;
            }

            // Run the matching after every N days, after a request or offer was added
            if (+currentDate > +matchRunDate + runDays * 24 * 60 * 60 * 1000) {
                await runMatching();
            }
        }

        await runMatching();
        // Run this twice, just in case the algo skipped duplicate assignments
        await runMatching();

        const summary = {
            matchCountSum: sum(matchCount),
            matchCountAvg: avg(matchCount),
            matchingSubjectsSum: sum(matchingSubjects),
            matchingSubjectsAvg: avg(matchingSubjects),
            matchingState,
            pupilWaitingTimeAvg: avg(pupilWaitingTime),
            studentWaitingTimeAvg: avg(studentWaitingTime),
            // runtime,
            matchRuns,
        };

        expect(summary).toMatchObject(expectedSummary);

        log += `\n\nSummary (every ${runDays} days):\n${JSON.stringify(summary, null, 4)}\n`;

        console.log(log);
    });
});
