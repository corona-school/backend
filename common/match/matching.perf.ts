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
        /* [
            'new',
            1000,
            {
                matchCountSum: 1041,
                matchingSubjectsAvg: 1.877041306436119,
                matchingSubjects: {
                    '>= 1': 1041,
                    '>= 2': 632,
                    '>= 3': 223,
                    '>= 4': 52,
                    '>= 5': 5,
                },
                matchingState: 0.46493756003842457,
                pupilWaitingTimeAvg: 294.63748241129935,
                pupilWaitingTime: {
                    '>= 0': 1041,
                    '>= 1': 1041,
                    '>= 7': 1041,
                    '>= 14': 1041,
                    '>= 21': 1041,
                    '>= 28': 1041,
                },
                studentWaitingTimeAvg: 328.5918544018619,
                studentWaitingTime: {
                    '>= 0': 1041,
                    '>= 1': 1041,
                    '>= 7': 1041,
                    '>= 14': 1041,
                    '>= 21': 1041,
                    '>= 28': 1041,
                    '>= 56': 1016,
                },
            },
        ], */
        [
            'new',
            10,
            {
                matchCountSum: 1045,
                matchingSubjectsAvg: 1.6794258373205742,
                matchingSubjects: {
                    '>= 1': 1045,
                    '>= 2': 555,
                    '>= 3': 119,
                    '>= 4': 31,
                    '>= 5': 4,
                },
                // matchingState: 0.11100478468899522,
                pupilWaitingTimeAvg: 8.342127835891821,
                pupilWaitingTime: {
                    '>= 0': 1045,
                    '>= 1': 959,
                    '>= 7': 429,
                    '>= 14': 72,
                    '>= 21': 53,
                    '>= 28': 41,
                },
                studentWaitingTimeAvg: 53.936342931009634,
                studentWaitingTime: {
                    '>= 0': 1045,
                    '>= 1': 1034,
                    '>= 7': 901,
                    '>= 14': 776,
                    '>= 21': 715,
                    '>= 28': 654,
                    '>= 56': 465,
                },
            },
        ],
        /* [
            'new',
            1,
            {
                matchCountSum: 1045,
                matchingSubjectsAvg: 1.632535885167464,
                matchingSubjects: {
                    '>= 1': 1045,
                    '>= 2': 497,
                    '>= 3': 126,
                    '>= 4': 30,
                    '>= 5': 7,
                },
                matchingState: 0.30239234449760766,
                pupilWaitingTimeAvg: 3.9678646337387073,
                pupilWaitingTime: {
                    '>= 0': 1045,
                    '>= 1': 326,
                    '>= 7': 75,
                    '>= 14': 52,
                    '>= 21': 40,
                    '>= 28': 33,
                },
                studentWaitingTimeAvg: 47.77617396444717,
                studentWaitingTime: {
                    '>= 0': 1045,
                    '>= 1': 923,
                    '>= 7': 746,
                    '>= 14': 648,
                    '>= 21': 576,
                    '>= 28': 525,
                    '>= 56': 377,
                },
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
        const max = (values: number[]) => Math.max(...values);
        const histogram = (values: number[], groups: number[]) => {
            const result: { [group: number]: number } = Object.fromEntries(groups.map((group) => [group, 0]));
            for (const value of values) {
                for (const group of groups) {
                    if (value < group) {
                        break;
                    }
                    result[group] += 1;
                }
            }

            return Object.fromEntries(Object.entries(result).map(([group, value]) => [`>= ${group}`, value]));
        };

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
                    ? computeMatchings(requestPool, offerPool, matchIds, currentDate)
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

                    if (requestSubject.mandatory) {
                        expect(found).toBeTruthy();
                    }
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

        currentDate = new Date(+currentDate + 31 * 24 * 60 * 60 * 1000);
        await runMatching();
        // Run this twice, just in case the algo skipped duplicate assignments
        await runMatching();

        const summary = {
            matchCountSum: sum(matchCount),
            matchingSubjectsAvg: avg(matchingSubjects),
            matchingSubjects: histogram(matchingSubjects, [1, 2, 3, 4, 5]),
            matchingState: matchingState / sum(matchCount),
            pupilWaitingTimeAvg: avg(pupilWaitingTime),
            pupilWaitingTime: histogram(pupilWaitingTime, [0, 1, 7, 14, 21, 28]),
            studentWaitingTimeAvg: avg(studentWaitingTime),
            studentWaitingTime: histogram(studentWaitingTime, [0, 1, 7, 14, 21, 28, 56]),
            // runtime,
            // matchRuns,
        };

        log += `\n\nSummary (every ${runDays} days):\n${JSON.stringify(summary, null, 4)}\n`;
        console.log(log);

        expect(summary).toMatchObject(expectedSummary);
    });
});
