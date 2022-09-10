import { prisma } from '../prisma';
import type { Prisma, pupil as Pupil, student as Student } from '@prisma/client';
import { Helpee, Helper, match, Settings, Match as MatchResult, SubjectWithGradeRestriction } from 'corona-school-matching';
import { createMatch } from './create';
import { parseSubjectString, Subject } from '../util/subjectsutils';
import { gradeAsInt } from '../util/gradestrings';
import { assertExists } from '../util/basic';
import { DEFAULT_TUTORING_GRADERESTRICTIONS } from '../entity/Student';
import { getLogger } from 'log4js';
import { isDev } from '../util/environment';
import { InterestConfirmationStatus } from '../entity/PupilTutoringInterestConfirmationRequest';
import { cleanupUnconfirmed, requestInterestConfirmation, sendInterestConfirmationReminders } from './interest';

const logger = getLogger('MatchingPool');

/* A MatchPool is a Set of students and a Set of pupils,
    which can then be matched to a Set of matches */
export interface MatchPool<Toggle extends string = string> {
    name: string;
    studentsToMatch: (toggles: Toggle[]) => Prisma.studentWhereInput;
    pupilsToMatch: (toggles: Toggle[]) => Prisma.pupilWhereInput;
    settings: Settings;
    createMatch(pupil: Pupil, student: Student, pool: MatchPool): Promise<void | never>;
    toggles: Toggle[];
    // There are a few well known toggles:
    //  "skip-interest-confirmation" -> do not exclude pupils that have not confirmed their interest
    //  "confirmation-pending" -> only return pupils that have not yet confirmed their interest
    //  "confirmation-unknown" -> pupils who have not been asked for their interest

    // if present, the matching is run automatically on a daily basis if the criteria are matched
    automatic?: {
        minStudents: number;
        minPupils: number;
    };
    confirmInterest?: boolean;
}

/* ---------------- UTILS ------------------------------------- */

const getViableUsers = (toggles: string[]) => {
    const viableUsers: Prisma.studentWhereInput & Prisma.pupilWhereInput = {
        active: true,
    };

    if (!toggles.includes('allow-unverified')) {
        viableUsers.verification = null; // require verification to be unset
    }

    /* On production we want to avoid that our testusers test+prod-...@lern-fair.de
    are accidentally matched to real users */
    if (!isDev) {
        viableUsers.email = { not: { startsWith: 'test', endsWith: '@lern-fair.de' } };
    }

    return viableUsers;
};

export async function getStudents(pool: MatchPool, toggles: string[], take?: number, skip?: number) {
    return await prisma.student.findMany({
        where: { ...getViableUsers(toggles), ...pool.studentsToMatch(toggles) },
        orderBy: { createdAt: 'asc' },
        take,
        skip,
    });
}

export async function getPupils(pool: MatchPool, toggles: string[], take?: number, skip?: number) {
    return await prisma.pupil.findMany({
        where: { ...getViableUsers(toggles), ...pool.pupilsToMatch(toggles) },
        orderBy: { createdAt: 'asc' },
        take,
        skip,
    });
}

export async function getStudentCount(pool: MatchPool, toggles: string[]) {
    return await prisma.student.count({
        where: { ...getViableUsers(toggles), ...pool.studentsToMatch(toggles) },
    });
}

export async function getStudentOfferCount(pool: MatchPool, toggles: string[]) {
    return (
        await prisma.student.aggregate({
            _sum: { openMatchRequestCount: true },
            where: { ...getViableUsers(toggles), ...pool.studentsToMatch(toggles) },
        })
    )._sum.openMatchRequestCount;
}

export async function getPupilCount(pool: MatchPool, toggles: string[]) {
    return await prisma.pupil.count({
        where: { ...getViableUsers(toggles), ...pool.pupilsToMatch(toggles) },
    });
}

export async function getPupilDemandCount(pool: MatchPool, toggles: string[]) {
    return (
        await prisma.pupil.aggregate({
            _sum: { openMatchRequestCount: true },
            where: { ...getViableUsers(toggles), ...pool.pupilsToMatch(toggles) },
        })
    )._sum.openMatchRequestCount;
}

async function studentToHelper(student: Student): Promise<Helper> {
    const existingMatches = await prisma.match.findMany({ select: { pupil: { select: { wix_id: true } } }, where: { studentId: student.id } });

    return {
        id: student.id,
        uuid: student.wix_id,
        matchRequestCount: student.openMatchRequestCount,
        subjects: parseSubjectString(student.subjects).map(formattedSubjectToSubjectWithGradeRestriction),
        createdAt: student.createdAt,
        excludeMatchesWith: existingMatches.map((it) => ({ uuid: it.pupil.wix_id })),
        state: student.state,
        // firstMatchRequest: student.firstMatchRequest
    };
}

async function pupilToHelpee(pupil: Pupil): Promise<Helpee> {
    const existingMatches = await prisma.match.findMany({ select: { student: { select: { wix_id: true } } }, where: { pupilId: pupil.id } });

    return {
        id: pupil.id,
        uuid: pupil.wix_id,
        matchRequestCount: pupil.openMatchRequestCount,
        subjects: parseSubjectString(pupil.subjects),
        createdAt: pupil.createdAt,
        excludeMatchesWith: existingMatches.map((it) => ({ uuid: it.student.wix_id })),
        state: pupil.state,
        matchingPriority: pupil.matchingPriority,
        grade: gradeAsInt(pupil.grade),
        // firstMatchRequest: pupil.firstMatchRequest
    };
}

function formattedSubjectToSubjectWithGradeRestriction(subject: Subject): SubjectWithGradeRestriction {
    return {
        name: subject.name,
        gradeRestriction: {
            min: subject.grade?.min ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MIN, //due to a screening tool's bug (or how it is designed), those values may be null (which causes the algorithm to fail)
            max: subject.grade?.max ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MAX,
        },
    };
}

/* ---------------------- POOLS ----------------------------------- */

const balancingCoefficients = {
    subjectMatching: 0.65,
    state: 0.05,
    waitingTime: 0.2,
    matchingPriority: 0.1,
};

export const pools: MatchPool[] = [
    {
        name: 'lern-fair-now',
        confirmInterest: true,
        toggles: ['skip-interest-confirmation', 'confirmation-pending', 'confirmation-unknown'],
        pupilsToMatch: (toggles) => {
            const query: Prisma.pupilWhereInput = {
                isPupil: true,
                openMatchRequestCount: { gt: 0 },
                subjects: { not: '[]' },
                registrationSource: { notIn: ['plus'] },
            };

            if (!toggles.includes('skip-interest-confirmation') && !toggles.includes('confirmation-pending') && !toggles.includes('confirmation-unknown')) {
                query.OR = [{ registrationSource: 'cooperation' }, { pupil_tutoring_interest_confirmation_request: { status: 'confirmed' } }];
            }

            if (toggles.includes('confirmation-pending')) {
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

                // The confirmation request sent but the user might still react to it (after more than two weeks this is unlikely)
                query.pupil_tutoring_interest_confirmation_request = { status: 'pending', createdAt: { gt: twoWeeksAgo } };
            }

            if (toggles.includes('confirmation-unknown')) {
                query.pupil_tutoring_interest_confirmation_request = null;
            }

            return query;
        },
        studentsToMatch: (toggles) => ({
            isStudent: true,
            openMatchRequestCount: { gt: 0 },
            subjects: { not: '[]' },
            screening: { success: true },
            registrationSource: { notIn: ['plus'] },
        }),
        createMatch,
        settings: { balancingCoefficients },
    },
    {
        name: 'lern-fair-plus',
        toggles: ['allow-unverified'],
        pupilsToMatch: (toggles) => ({
            isPupil: true,
            openMatchRequestCount: { gt: 0 },
            subjects: { not: '[]' },
            registrationSource: { equals: 'plus' },
        }),
        studentsToMatch: (toggles) => ({
            isStudent: true,
            openMatchRequestCount: { gt: 0 },
            subjects: { not: '[]' },
            screening: { success: true },
            registrationSource: { equals: 'plus' },
        }),
        createMatch,
        settings: { balancingCoefficients },
    },
    {
        name: 'TEST-DO-NOT-USE',
        toggles: ['allow-unverified'],
        pupilsToMatch: (toggles) => ({
            isPupil: true,
            openMatchRequestCount: { gt: 0 },
        }),
        studentsToMatch: (toggles) => ({
            isStudent: true,
            openMatchRequestCount: { gt: 0 },
        }),
        createMatch(pupil, student) {
            if (!isDev) {
                throw new Error(`The Test Pool may not be run in production!`);
            }
            return createMatch(pupil, student, this);
        },
        settings: { balancingCoefficients },
    },
];

/* ---------------------- MATCHING RUNS ----------------------------- */

export async function getPoolRuns(pool: MatchPool) {
    return await prisma.match_pool_run.findMany({ where: { matchingPool: pool.name } });
}

export async function runMatching(poolName: string, apply: boolean, toggles: string[]) {
    const pool = pools.find((it) => it.name === poolName);
    if (!pool) {
        throw new Error(`Unknown Pool '${poolName}'`);
    }

    const invalidToggles = toggles.filter((it) => !pool.toggles.includes(it));
    if (invalidToggles.length > 0) {
        throw new Error(`Unknown toggles ${invalidToggles} for pool '${pool.name}'`);
    }

    logger.info(`MatchingPool(${pool.name}) started matching (apply: ${apply}, toggles: ${toggles})`);

    const timing = { preparation: 0, matching: 0, commit: 0 };

    const startPreparation = Date.now();
    const pupils = await getPupils(pool, toggles);
    const students = await getStudents(pool, toggles);

    // The matching algorithm works on it's own entities, but we need to map them back to pupils and students when receiving the result
    const pupilsMap = new Map(pupils.map((it) => [it.wix_id, it]));
    const studentsMap = new Map(students.map((it) => [it.wix_id, it]));

    const helpers: Helper[] = await Promise.all(students.map(studentToHelper));
    const helpees: Helpee[] = await Promise.all(pupils.map(pupilToHelpee));

    timing.preparation = Date.now() - startPreparation;
    logger.info(`MatchingPool(${pool.name}) found ${pupils.length} pupils and ${students.length} students for matching in ${timing.preparation}ms`);

    const startMatching = Date.now();
    const result = match(helpers, helpees, pool.settings);

    const matches = result.matches.map((it) => ({
        student: assertExists(studentsMap.get(it.helper.uuid)),
        pupil: assertExists(pupilsMap.get(it.helpee.uuid)),
    }));

    timing.matching = Date.now() - startMatching;
    logger.info(`MatchingPool(${pool.name}) calculated ${matches.length} matches in ${timing.matching}ms`);

    const stats = { ...result.stats, toggles };

    if (apply) {
        const startCommit = Date.now();
        for (const match of matches) {
            await pool.createMatch(match.pupil, match.student, pool);
        }

        timing.commit = Date.now() - startCommit;
        logger.info(`MatchingPool(${pool.name}) created ${matches.length} matches in ${timing.matching}ms`);

        await prisma.match_pool_run.create({
            data: {
                matchingPool: pool.name,
                matchesCreated: matches.length,
                stats,
            },
        });
    }

    return {
        timing,
        stats,
        matches,
    };
}

export async function runAutomaticMatching() {
    logger.info(`Started automatic matching`);

    for (const pool of pools) {
        if (!pool.automatic) {
            continue;
        }

        const pupilCount = await getPupilCount(pool, []);
        if (pupilCount < pool.automatic.minPupils) {
            logger.info(`MatchinPool(${pool.name}) is not matched as only ${pupilCount} pupils are waiting, ${pool.automatic.minPupils} are required`);
            continue;
        }

        const studentCount = await getStudentCount(pool, []);
        if (studentCount < pool.automatic.minStudents) {
            logger.info(`MatchinPool(${pool.name}) is not matched as only ${studentCount} students are waiting, ${pool.automatic.minStudents} are required`);
            continue;
        }

        await runMatching(pool.name, true, []);
    }

    logger.info(`Finished automatic matching`);
}

/* ----------------------- STATISTICS & PREDICTION ----------------------- */

const average = <T>(values: T[], mapper: (it: T) => number) => values.map(mapper).reduce((a, b) => a + b, 0) / Math.max(1, values.length);

export interface MatchPoolStatistics {
    matchesByMonth: {
        month: number;
        year: number;
        matches: number;
        subjects: {
            [subject: string]: { offered: number; requested: number; fulfilled: number };
        };
    }[];
    averageMatchesPerMonth: number;
    predictedPupilMatchTime: number /* in days */;
    subjectDemand: { subject: string; demand: number /* >1 -> too many offers, <1 -> to few offers */ }[];
}

const statisticsCache: { [pool: string]: { at: number; result: Promise<MatchPoolStatistics> } } = {};

export function getPoolStatistics(pool: MatchPool): Promise<MatchPoolStatistics> {
    const existingStat = statisticsCache[pool.name];

    // Cache statistics for one hour
    if (existingStat && existingStat.at > Date.now() - 1000 * 60 * 60) {
        return existingStat.result;
    }

    const result = (async function () {
        const runs = await getPoolRuns(pool);

        // Aggregate Runs by Month, as Runs happen irregularly this averages out slightly
        const monthToStatistics = new Map<string, MatchPoolStatistics['matchesByMonth'][number]>();

        for (const { runAt, matchesCreated, stats } of runs) {
            const { subjectStats } = stats as any;

            const runAtDate = new Date(runAt);
            const month = runAtDate.getMonth() + 1;
            const year = runAtDate.getFullYear();

            const key = `${month}/${year}`;
            let entry = monthToStatistics.get(key);
            if (!entry) {
                entry = { subjects: {}, matches: 0, month, year };
                monthToStatistics.set(key, entry);
            }

            entry.matches += matchesCreated;
            for (const {
                name,
                stats: { offered, requested, fulfilledRequests },
            } of subjectStats) {
                const subjectStats = entry.subjects[name] ?? (entry.subjects[name] = { requested: 0, fulfilled: 0, offered: 0 });
                subjectStats.fulfilled += fulfilledRequests;
                subjectStats.offered += offered;
                subjectStats.requested += requested;
            }
        }

        const matchesByMonth = [...monthToStatistics.values()];
        matchesByMonth.sort((a, b) => a.year - b.year || a.month - b.month);

        // Average Matches in the last three months
        const averageMatchesPerMonth = average(matchesByMonth.slice(-3), (it) => it.matches);

        // Predict Pupil Match Time
        const predictedPupilMatchTime = await predictPupilMatchTime(pool, averageMatchesPerMonth);

        // Current Subject Demand in the last finished month
        const lastMonth = matchesByMonth.slice(-2)[0];
        const subjectDemand = Object.entries(lastMonth?.subjects ?? {}).map(([subject, { fulfilled, offered, requested }]) => ({
            subject,
            demand: requested / offered,
        }));

        const result: MatchPoolStatistics = {
            matchesByMonth,
            averageMatchesPerMonth,
            predictedPupilMatchTime,
            subjectDemand,
        };

        return result;
    })();

    statisticsCache[pool.name] = { at: Date.now(), result };
    return result;
}

// Averaging over all interest confirmations does not really factor in trends
//  though looking at the last month alone would also be inaccurate as
//  confirmations are delayed, thus pending confirmations would be overestimated
export async function getInterestConfirmationRate() {
    const totalInterestConfirmations = await prisma.pupil_tutoring_interest_confirmation_request.count({});
    const confirmedInterestConfirmations = await prisma.pupil_tutoring_interest_confirmation_request.count({
        where: { status: InterestConfirmationStatus.CONFIRMED },
    });

    return confirmedInterestConfirmations / totalInterestConfirmations;
}

// Predicted Pupil Match Time in Days
// As we do not collect the actual wait time, this is only a very rough estimation
export async function predictPupilMatchTime(pool: MatchPool, averageMatchesPerMonth: number): Promise<number> {
    // Number of Pupils waiting for a Match
    // This is slightly inaccurate, as pupils could theoretically have multiple match requests
    // Though at the moment it is limited to one per pupil
    let backlog = await getPupilCount(pool, []);

    // If the Pool uses interest confirmations, we also count those that are not yet viable for a match
    // as they were not yet asked for an interest confirmation
    // From those we lose about a third of pupils as they do not confirm their interest
    // This needs to be factored in, as it reduces the actual waiting time
    if (pool.toggles.includes('skip-interest-confirmation')) {
        backlog +=
            ((await getPupilCount(pool, ['confirmation-pending'])) + (await getPupilCount(pool, ['confirmation-unknown']))) *
            (await getInterestConfirmationRate());
    }

    return Math.round((backlog / Math.max(1, averageMatchesPerMonth)) * 30);
}

/* ------------------------------ Confirmation Requests ------------- */

export async function confirmationRequestsToSend(pool: MatchPool) {
    const offers = await getStudentOfferCount(pool, []);
    const requests = await getPupilDemandCount(pool, []);
    const openOffers = Math.max(0, offers - requests);

    const comfirmationsPending = await getPupilDemandCount(pool, ['confirmation-pending']);
    const requestsToSend = Math.max(0, openOffers - comfirmationsPending);

    return requestsToSend;
}

async function offeredSubjects(pool: MatchPool): Promise<string[]> {
    const subjects = new Set<string>();
    const students = await getStudents(pool, [], 100);
    for (const student of students) {
        for (const subject of JSON.parse(student.subjects)) {
            subjects.add(subject.name);
        }
    }

    return [...subjects];
}

export async function sendConfirmationRequests(pool: MatchPool) {
    let toSend = await confirmationRequestsToSend(pool);
    if (toSend <= 0) {
        return;
    }

    const offered = await offeredSubjects(pool);

    const pupilsToRequest = await getPupils(pool, ['confirmation-unknown'], toSend * 5);
    for (const pupil of pupilsToRequest) {
        // Skip pupils who only want subjects that are not offered at the moment
        const subjects = JSON.parse(pupil.subjects).map((it) => it.name);
        if (!subjects.some((it) => offered.includes(it))) {
            continue;
        }

        await requestInterestConfirmation(pupil);

        toSend -= 1;
        if (toSend <= 0) {
            break;
        }
    }
}

export async function runInterestConfirmations() {
    for (const pool of pools) {
        if (pool.confirmInterest) {
            await sendConfirmationRequests(pool);
        }
    }

    await sendInterestConfirmationReminders();
    await cleanupUnconfirmed();
}
