import { readFileSync } from 'fs';
import { computeMatchings, Matching, MatchOffer, MatchRequest } from './matching';
import { parseSubjectString } from '../util/subjectsutils';
import { pupil_state_enum, student_state_enum } from '@prisma/client';
import assert from 'assert';
import { formattedSubjectToSubjectWithGradeRestriction } from './util';
import { gradeAsInt } from '../util/gradestrings';

/* Export from all pupils and students that were in a match till 14.09.2024
   (since we started recording match request dates)

   SELECT "student"."subjects", "student"."state", "match"."studentFirstMatchRequest" FROM "student"
      INNER JOIN "match" ON "match"."studentId" = "student"."id"
      WHERE "match"."studentFirstMatchRequest" IS NOT NULL
      ORDER BY "match"."studentFirstMatchRequest" ASC;

   SELECT "pupil"."subjects", "pupil"."state", "pupil"."grade", "match"."pupilFirstMatchRequest" FROM "pupil"
      INNER JOIN "match" ON "match"."pupilId" = "pupil"."id"
      WHERE "match"."pupilFirstMatchRequest" IS NOT NULL
      ORDER BY "match"."pupilFirstMatchRequest" ASC;
*/
interface HistoryEntry {
    requestAt: string;
    subjects: string;
    state: pupil_state_enum | student_state_enum;
    grade?: string;
}

const pupils = JSON.parse(readFileSync(__dirname + '/matching.perf.pupil.json', { encoding: 'utf-8' })) as HistoryEntry[];
const students = JSON.parse(readFileSync(__dirname + '/matching.perf.student.json', { encoding: 'utf-8' })) as HistoryEntry[];

async function computeOldMatchings(requests: MatchRequest[], offers: MatchOffer[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { match } = await import('corona-school-matching');

    const oldRequests = requests.map((it, idx) => ({
        id: idx,
        uuid: `${idx}`,
        matchRequestCount: 1,
        subjects: it.subjects.map(formattedSubjectToSubjectWithGradeRestriction),
        createdAt: new Date(),
        excludeMatchesWith: [],
        state: it.state,
        grade: it.grade,
        // firstMatchRequest: student.firstMatchRequest
    }));

    const oldOffers = offers.map((it, idx) => ({
        id: idx,
        uuid: `${idx}`,
        matchRequestCount: 1,
        subjects: it.subjects.map(formattedSubjectToSubjectWithGradeRestriction),
        createdAt: new Date(),
        excludeMatchesWith: [],
        state: it.state,
        // firstMatchRequest: student.firstMatchRequest
    }));

    const result = match(oldRequests, oldOffers, {
        balancingCoefficients: {
            subjectMatching: 0.65,
            state: 0.05,
            waitingTime: 0.2,
            matchingPriority: 0.1,
        },
    });

    const matching: Matching = result.matches.map((it) => ({
        request: requests[+it.helpee.uuid],
        offer: offers[+it.helper.uuid],
    }));
}

const algos = { new: computeMatchings, old: computeOldMatchings };

describe('Real World Matching Performance', () => {
    test.each([
        [
            'new',
            1000,
            {
                matchCountSum: 1045,
                matchCountAvg: 1045,
                matchingSubjectsSum: 2033,
                matchingSubjectsAvg: 1.9454545454545455,
                matchingState: 112,
                pupilWaitingTimeAvg: 263.2308717733258,
                studentWaitingTimeAvg: 308.0854242005476,
                matchRuns: 1,
            },
        ],
        // ["old", 1000],
        [
            'new',
            10,
            {
                matchCountSum: 1045,
                matchCountAvg: 15.833333333333334,
                matchingSubjectsSum: 1781,
                matchingSubjectsAvg: 1.7043062200956938,
                matchingState: 118,
                pupilWaitingTimeAvg: 8.363637099337685,
                studentWaitingTimeAvg: 54.521507174685425,
                matchRuns: 66,
            },
        ],
        // ["old", 10],
        [
            'new',
            1,
            {
                matchCountSum: 1045,
                matchCountAvg: 2.4189814814814814,
                matchingSubjectsSum: 1733,
                matchingSubjectsAvg: 1.6583732057416267,
                matchingState: 119,
                pupilWaitingTimeAvg: 3.8293450684808668,
                studentWaitingTimeAvg: 49.29864967141816,
                matchRuns: 432,
            },
        ],
        // ["old", 1]
    ])('%s algorithm - Run every %s days', (algo, runDays, expectedSummary) => {
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

        function runMatching() {
            const start = performance.now();
            const runMatches = algos[algo](requestPool, offerPool);
            const duration = performance.now() - start;
            runtime += duration;
            matchRuns += 1;

            // log += `-> matched ${requestPool.length} requests and ${offerPool.length} offers to ${runMatches.length} matches in ${duration}ms\n`;

            matchCount.push(runMatches.length);
            for (const match of runMatches) {
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

                requestPool.splice(requestPool.indexOf(match.request), 1);
                offerPool.splice(offerPool.indexOf(match.offer), 1);
            }

            matchRunDate = currentDate;
        }

        while (pupilIdx < pupils.length || studentIdx < students.length) {
            const pupil = pupils[pupilIdx];
            const student = students[studentIdx];

            if (!student || pupil.requestAt < student.requestAt) {
                // For ISO dates string order = date order
                requestPool.push({
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

            if (+currentDate > +matchRunDate + runDays * 24 * 60 * 60 * 1000) {
                runMatching();
            }
        }

        runMatching();

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
