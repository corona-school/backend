import { prisma } from '../prisma';
import type { Prisma, pupil as Pupil, student as Student, match as Match } from '@prisma/client';
import { createMatch } from './create';
import { assertExists } from '../util/basic';
import { getLogger } from '../logger/logger';
import { isDev } from '../util/environment';
import { cleanupUnconfirmed, InterestConfirmationStatus, requestInterestConfirmation, sendInterestConfirmationReminders } from './interest';
import { userSearch } from '../user/search';
import { addPupilScreening } from '../pupil/screening';
import assert from 'assert';
import { computeMatchings, getMatchExclusions, MatchOffer, MatchRequest, pupilsToRequests, studentsToOffers } from './matching';

const logger = getLogger('MatchingPool');

/* A MatchPool is a Set of students and a Set of pupils,
    which can then be matched to a Set of matches */

type Toggle = InterestConfirmationToggle | PupilScreeningToggle | 'allow-unverified';

export interface MatchPool {
    readonly name: string;
    studentsToMatch: (toggles: readonly Toggle[]) => Prisma.studentWhereInput;
    pupilsToMatch: (toggles: readonly Toggle[]) => Prisma.pupilWhereInput;
    readonly createMatch: (pupil: Pupil, student: Student, pool: MatchPool) => Promise<Match>;
    readonly toggles: readonly Toggle[];
    // There are a few well known toggles:
    //  "skip-interest-confirmation" -> do not exclude pupils that have not confirmed their interest
    //  "confirmation-pending" -> only return pupils that have not yet confirmed their interest
    //  "confirmation-unknown" -> pupils who have not been asked for their interest

    // if present, the matching is run automatically on a daily basis if the criteria are matched
    // Not used yet
    readonly automatic?: {
        readonly minStudents: number;
        readonly minPupils: number;
    };

    // If set, pupils are automatically invited for screening or interest confirmation
    // Otherwise this can be done manually via GraphQL
    readonly autoInviteForInterestConfirmation?: boolean;
    readonly autoInviteForScreening?: boolean;
}

/* ---------------- UTILS ------------------------------------- */

const getViableUsers = (toggles: string[]) => {
    const viableUsers: Prisma.studentWhereInput & Prisma.pupilWhereInput = {
        active: true,
    };

    if (!toggles.includes('allow-unverified')) {
        viableUsers.verifiedAt = { not: null }; // require verifiedAt to be set
    }

    /* On production we want to avoid that our testusers test+prod-...@lern-fair.de
    are accidentally matched to real users */
    if (!isDev) {
        viableUsers.NOT = [{ email: { startsWith: 'test', endsWith: '@lern-fair.de' } }];
    }

    return viableUsers;
};

export async function getStudents(pool: MatchPool, toggles: Toggle[], take?: number, skip?: number, search?: string) {
    const where = { ...getViableUsers(toggles), ...pool.studentsToMatch(toggles) };

    return await prisma.student.findMany({
        where: { AND: [where, userSearch(search)] },
        orderBy: { createdAt: 'asc' },
        take,
        skip,
    });
}

export async function getPupils(pool: MatchPool, toggles: Toggle[], take?: number, skip?: number, search?: string) {
    const where = { ...getViableUsers(toggles), ...pool.pupilsToMatch(toggles) };

    return await prisma.pupil.findMany({
        where: { AND: [where, userSearch(search)] },
        orderBy: [
            { match: { _count: 'asc' } },
            {
                firstMatchRequest: {
                    sort: 'asc',
                    nulls: 'first',
                },
            },
            { createdAt: 'asc' },
        ],
        take,
        skip,
    });
}

export async function getStudentCount(pool: MatchPool, toggles: Toggle[]) {
    return await prisma.student.count({
        where: { ...getViableUsers(toggles), ...pool.studentsToMatch(toggles) },
    });
}

export async function getStudentOfferCount(pool: MatchPool, toggles: Toggle[]) {
    return (
        await prisma.student.aggregate({
            _sum: { openMatchRequestCount: true },
            where: { ...getViableUsers(toggles), ...pool.studentsToMatch(toggles) },
        })
    )._sum.openMatchRequestCount;
}

export async function getPupilCount(pool: MatchPool, toggles: Toggle[]) {
    return await prisma.pupil.count({
        where: { ...getViableUsers(toggles), ...pool.pupilsToMatch(toggles) },
    });
}

export async function getPupilDemandCount(pool: MatchPool, toggles: Toggle[]) {
    return (
        await prisma.pupil.aggregate({
            _sum: { openMatchRequestCount: true },
            where: { ...getViableUsers(toggles), ...pool.pupilsToMatch(toggles) },
        })
    )._sum.openMatchRequestCount;
}

const INTEREST_CONFIRMATION_TOGGLES = ['confirmation-success', 'confirmation-pending', 'confirmation-unknown'] as const;
type InterestConfirmationToggle = (typeof INTEREST_CONFIRMATION_TOGGLES)[number];

function addInterestConfirmationFilter(query: Prisma.pupilWhereInput, toggles: string[] | InterestConfirmationToggle[]) {
    if (+toggles.includes('confirmation-success') + +toggles.includes('confirmation-pending') + +toggles.includes('confirmation-unknown') > 1) {
        throw new Error(`Only one confirmation- toggle may be present!`);
    }

    if (toggles.includes('confirmation-success')) {
        query.pupil_tutoring_interest_confirmation_request = { some: { status: 'confirmed', invalidated: false } };
    }

    if (toggles.includes('confirmation-pending')) {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        // The confirmation request sent but the user might still react to it (after more than two weeks this is unlikely)
        query.pupil_tutoring_interest_confirmation_request = {
            some: {
                status: 'pending',
                createdAt: { gt: twoWeeksAgo },
                invalidated: false,
            },
        };
    }

    if (toggles.includes('confirmation-unknown')) {
        query.pupil_tutoring_interest_confirmation_request = {
            none: { invalidated: false },
        };
    }
}

const PUPIL_SCREENING_TOGGLES = ['pupil-screening-unknown', 'pupil-screening-success', 'pupil-screening-pending'] as const;
type PupilScreeningToggle = (typeof PUPIL_SCREENING_TOGGLES)[number];

function addPupilScreeningFilter(query: Prisma.pupilWhereInput, toggles: string[] | PupilScreeningToggle[]) {
    if (+toggles.includes('pupil-screening-success') + +toggles.includes('pupil-screening-pending') + +toggles.includes('pupil-screening-unknown') > 1) {
        throw new Error(`Only one screening- toggle may be present!`);
    }

    if (toggles.includes('pupil-screening-success')) {
        query.pupil_screening = {
            some: {
                invalidated: false,
                status: 'success',
            },
        };
    }

    if (toggles.includes('pupil-screening-pending')) {
        query.pupil_screening = {
            some: {
                invalidated: false,
                status: 'pending',
            },
        };
    }

    if (toggles.includes('pupil-screening-unknown')) {
        query.pupil_screening = {
            none: { invalidated: false },
        };
    }
}

/* ---------------------- POOLS ----------------------------------- */

export const TEST_POOL = {
    name: 'TEST-DO-NOT-USE',
    toggles: ['allow-unverified'],
    pupilsToMatch: (toggles): Prisma.pupilWhereInput => ({
        isPupil: true,
        openMatchRequestCount: { gt: 0 },
    }),
    studentsToMatch: (toggles): Prisma.studentWhereInput => ({
        isStudent: true,
        openMatchRequestCount: { gt: 0 },
    }),
    createMatch(pupil, student) {
        if (!isDev) {
            throw new Error(`The Test Pool may not be run in production!`);
        }
        return createMatch(pupil, student, this);
    },
} as const;

const _pools = [
    {
        name: 'lern-fair-now',
        autoInviteForScreening: true,
        toggles: [...INTEREST_CONFIRMATION_TOGGLES, ...PUPIL_SCREENING_TOGGLES],

        pupilsToMatch: (toggles: (InterestConfirmationToggle | PupilScreeningToggle)[]): Prisma.pupilWhereInput => {
            const query: Prisma.pupilWhereInput = {
                isPupil: true,
                openMatchRequestCount: { gt: 0 },
                subjects: { not: '[]' },
                registrationSource: { notIn: ['plus'] },
            };

            addInterestConfirmationFilter(query, toggles);
            addPupilScreeningFilter(query, toggles);

            if (toggles.length === 0) {
                // As we slowly move from pupil screening to interest confirmations, by default take those pupils that have either the one or the other
                query.OR = [
                    { pupil_screening: { some: { status: 'success', invalidated: false } } },
                    {
                        pupil_tutoring_interest_confirmation_request: {
                            some: {
                                status: 'confirmed',
                                invalidated: false,
                            },
                        },
                    },
                ];

                assert(!query.pupil_screening, 'expected no pupil_screening filter to be present');
                assert(!query.pupil_tutoring_interest_confirmation_request, 'expected no interest confirmation filter to be present');
            }

            return query;
        },
        studentsToMatch: (toggles): Prisma.studentWhereInput => ({
            isStudent: true,
            openMatchRequestCount: { gt: 0 },
            subjects: { not: '[]' },
            screening: { success: true },
            registrationSource: { notIn: ['plus'] },
        }),
        createMatch,
    },
    {
        name: 'lern-fair-plus',
        toggles: ['allow-unverified', ...PUPIL_SCREENING_TOGGLES],
        pupilsToMatch: (toggles: PupilScreeningToggle[]): Prisma.pupilWhereInput => {
            const query: Prisma.pupilWhereInput = {
                isPupil: true,
                openMatchRequestCount: { gt: 0 },
                subjects: { not: '[]' },
                registrationSource: { equals: 'plus' },
            };

            if (toggles.length === 0) {
                toggles = ['pupil-screening-success'];
            }

            addPupilScreeningFilter(query, toggles);

            return query;
        },
        studentsToMatch: (toggles): Prisma.studentWhereInput => ({
            isStudent: true,
            openMatchRequestCount: { gt: 0 },
            subjects: { not: '[]' },
            screening: { success: true },
            registrationSource: { equals: 'plus' },
        }),
        createMatch,
    },
    TEST_POOL,
] as const;
export const pools: Readonly<MatchPool[]> = _pools;
export type ConcreteMatchPool = (typeof _pools)[number];

/* ---------------------- MATCHING RUNS ----------------------------- */

export async function getPoolRuns(pool: MatchPool) {
    return await prisma.match_pool_run.findMany({ where: { matchingPool: pool.name } });
}

export function validatePoolToggles<T>(pool: MatchPool, toggles: string[]): Toggle[] {
    const invalidToggles = toggles.filter((it) => !pool.toggles.includes(it as Toggle));
    if (invalidToggles.length > 0) {
        throw new Error(`Unknown toggles ${invalidToggles} for pool '${pool.name}'`);
    }

    return toggles as Toggle[];
}

export async function runMatching(poolName: string, apply: boolean, _toggles: string[]) {
    const pool = pools.find((it) => it.name === poolName);
    if (!pool) {
        throw new Error(`Unknown Pool '${poolName}'`);
    }

    const toggles = validatePoolToggles(pool, _toggles);
    logger.info(`MatchingPool(${pool.name}) started matching (apply: ${apply}, toggles: ${toggles})`);

    const timing = { preparation: 0, matching: 0, commit: 0 };

    const startPreparation = Date.now();
    const pupils = await getPupils(pool, toggles);
    const students = await getStudents(pool, toggles);

    const offers: MatchOffer[] = studentsToOffers(students);
    const requests: MatchRequest[] = pupilsToRequests(pupils);

    const subjectStats = new Map<string, { offered: number; requested: number; requestedMandatory: number; fulfilledRequests: number }>();

    for (const request of requests) {
        for (const subject of request.subjects) {
            if (!subjectStats.has(subject.name)) {
                subjectStats.set(subject.name, { fulfilledRequests: 0, offered: 0, requested: 0, requestedMandatory: 0 });
            }

            const subjectStat = subjectStats.get(subject.name);
            subjectStat.requested += 1;
            if (subject.mandatory) {
                subjectStat.requestedMandatory += 1;
            }
        }
    }

    for (const offer of offers) {
        for (const subject of offer.subjects) {
            if (!subjectStats.has(subject.name)) {
                subjectStats.set(subject.name, { fulfilledRequests: 0, offered: 0, requested: 0, requestedMandatory: 0 });
            }

            const subjectStat = subjectStats.get(subject.name);
            subjectStat.offered += 1;
        }
    }

    timing.preparation = Date.now() - startPreparation;
    logger.info(`MatchingPool(${pool.name}) found ${pupils.length} pupils and ${students.length} students for matching in ${timing.preparation}ms`);

    const startMatching = Date.now();

    const excludeMatchings = await getMatchExclusions(requests, offers);
    const result = computeMatchings(requests, offers, excludeMatchings);

    const matches = result.map((it) => ({
        student: assertExists(it.offer.student),
        pupil: assertExists(it.request.pupil),
    }));

    timing.matching = Date.now() - startMatching;
    logger.info(`MatchingPool(${pool.name}) calculated ${matches.length} matches in ${timing.matching}ms`);

    for (const matching of result) {
        for (const offeredSubject of matching.offer.subjects) {
            for (const requestedSubject of matching.request.subjects) {
                if (offeredSubject.name === requestedSubject.name) {
                    const subjectStat = assertExists(subjectStats.get(offeredSubject.name));
                    subjectStat.fulfilledRequests += 1;
                }
            }
        }
    }

    const stats = {
        helperCount: students.length,
        helpeeCount: pupils.length,
        matchCount: result.length,
        // The old matching algorithm additionally reported these, removed them for now,
        // we might want to compute them again if needed:
        // averageWaitingDaysMatchedHelpee: 0,
        // mostWaitingDaysUnmatchedHelpee: 0,
        // numberOfCoveredSubjects: 0,
        // numberOfUncoveredSubjects: 0,
        // numberOfOfferedSubjects: 0,
        toggles,
        subjectStats: [...subjectStats.entries()].map(([name, stats]) => ({ name, stats })),
    };

    if (apply) {
        const startCommit = Date.now();
        const createdMatches: Match[] = [];

        for (const match of matches) {
            createdMatches.push(await pool.createMatch(match.pupil, match.student, pool));
        }

        timing.commit = Date.now() - startCommit;
        logger.info(`MatchingPool(${pool.name}) created ${matches.length} matches in ${timing.matching}ms`);

        const run = await prisma.match_pool_run.create({
            data: {
                matchingPool: pool.name,
                matchesCreated: matches.length,
                stats,
            },
        });

        // After creating matches and the match run, link them together
        await prisma.match.updateMany({
            data: { matchPoolRunId: run.id },
            where: { id: { in: createdMatches.map((it) => it.id) } },
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
            [subject: string]: { offered: number; requested: number; requestedMandatory?: number; fulfilled: number };
        };
    }[];
    averageMatchesPerMonth: number;
    predictedPupilMatchTime: number /* in days */;
    subjectDemand: {
        subject: string;
        demand: number; // >1 -> too many offers, <1 -> to few offers
        offered: number;
        requested: number;
        requestedMandatory?: number;
    }[];
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
                stats: { offered, requested, fulfilledRequests, requestedMandatory },
            } of subjectStats) {
                const subjectStats =
                    entry.subjects[name] ??
                    (entry.subjects[name] = {
                        requested: 0,
                        requestedMandatory: 0,
                        fulfilled: 0,
                        offered: 0,
                    });
                subjectStats.fulfilled += fulfilledRequests;
                subjectStats.requestedMandatory += requestedMandatory;
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
        const subjectDemand = Object.entries(lastMonth?.subjects ?? {}).map(([subject, { fulfilled, offered, requested, requestedMandatory }]) => ({
            subject,
            demand: requested / offered,
            offered: offered,
            requested: requested,
            requestedMandatory: isNaN(requestedMandatory) ? null : requestedMandatory,
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

    return confirmedInterestConfirmations / totalInterestConfirmations || 0;
}

export async function getScreeningSuccessRate() {
    const totalScreenings = await prisma.pupil_screening.count({});
    const successfulScreenings = await prisma.pupil_screening.count({
        where: { status: 'success' },
    });

    return successfulScreenings / totalScreenings || 0;
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
    if (pool.toggles.includes('confirmation-pending')) {
        const futureConfirmations = pool.autoInviteForInterestConfirmation ? await getPupilCount(pool, ['pupil-screening-unknown', 'confirmation-unknown']) : 0;
        const pendingConfirmations = await getPupilCount(pool, ['confirmation-pending']);
        backlog += (futureConfirmations + pendingConfirmations) * (await getInterestConfirmationRate());
    }

    if (pool.toggles.includes('pupil-screening-pending')) {
        const futureScreenings = pool.autoInviteForScreening ? await getPupilCount(pool, ['pupil-screening-unknown', 'confirmation-unknown']) : 0;
        const pendingScreenings = await getPupilCount(pool, ['pupil-screening-pending']);
        backlog += (futureScreenings + pendingScreenings) * (await getScreeningSuccessRate());
    }

    return Math.round((backlog / Math.max(1, averageMatchesPerMonth)) * 30);
}

/* ------------------------------ Confirmation Requests ------------- */

// It takes some time for pupils to confirm interest and get matched
// (at most two weeks till the interest gets invalidated)
// Thus we always want to have more pupils in the backlog
const OVERPROVISION_DEMAND = 40;

export async function confirmationRequestsToSend(pool: MatchPool) {
    const offers = await getStudentOfferCount(pool, []);
    const requests = await getPupilDemandCount(pool, []);
    const openOffers = Math.max(0, offers + OVERPROVISION_DEMAND - requests);

    // If the interest confirmation rate is 10%, we need to ask 100 pupils to get 10 confirmations
    const confirmationsNeeded = Math.floor(openOffers / ((await getInterestConfirmationRate()) || 1));

    const confirmationsPending = await getPupilDemandCount(pool, ['confirmation-pending']);
    const requestsToSend = Math.max(0, confirmationsNeeded - confirmationsPending);

    return requestsToSend;
}

// As Screenings are held by the Lern-Fair Team, prevent scheduling to many screenings at once
const MAX_SCREENINGS_PER_DAY = 10;

export async function screeningInvitationsToSend(pool: MatchPool) {
    const offers = await getStudentOfferCount(pool, []);
    const requests = await getPupilDemandCount(pool, []);
    const openOffers = Math.max(0, offers + OVERPROVISION_DEMAND - requests);

    const successRate = (await getScreeningSuccessRate()) || 1;
    const screeningsNeeded = Math.floor(openOffers / successRate);

    const screeningPending = await getPupilDemandCount(pool, ['pupil-screening-pending']);
    const requestsToSend = Math.max(0, screeningsNeeded - screeningPending);

    const requestsToSendLimited = Math.min(requestsToSend, MAX_SCREENINGS_PER_DAY);

    logger.info(`Calculated screening invitations to send`, {
        offers,
        requests,
        openOffers,
        screeningsNeeded,
        screeningPending,
        requestsToSend,
        requestsToSendLimited,
    });
    return requestsToSendLimited;
}

export async function getPupilsToContactNext(pool: MatchPool, toggles: Toggle[], toSend: number): Promise<Pupil[]> {
    if (toSend <= 0) {
        return [];
    }

    const result: Pupil[] = [];

    const pupilsToRequest = await getPupils(pool, toggles, toSend * 5);
    for (const pupil of pupilsToRequest) {
        result.push(pupil);

        toSend -= 1;
        if (toSend <= 0) {
            break;
        }
    }

    return result;
}

export async function sendConfirmationRequests(pool: MatchPool) {
    const toSend = await confirmationRequestsToSend(pool);
    const pupils = await getPupilsToContactNext(pool, ['confirmation-unknown', 'pupil-screening-unknown'], toSend);
    for (const pupil of pupils) {
        await requestInterestConfirmation(pupil);
    }
}

export async function addPupilScreenings(pool: MatchPool, toSendCount?: number) {
    if (toSendCount === undefined) {
        toSendCount = await screeningInvitationsToSend(pool);
        logger.info(`Calculated ${toSendCount} pupil screening invitations to send`);
    }

    logger.info(`Inviting ${toSendCount} to the pupil screening`);

    const pupils = await getPupilsToContactNext(pool, ['confirmation-unknown', 'pupil-screening-unknown'], toSendCount);
    for (const pupil of pupils) {
        await addPupilScreening(pupil);
    }
}

export async function runInterestConfirmations() {
    for (const pool of pools) {
        if (pool.autoInviteForInterestConfirmation) {
            await sendConfirmationRequests(pool);
        }

        if (pool.autoInviteForScreening) {
            await addPupilScreenings(pool);
        }
    }

    await sendInterestConfirmationReminders();
    await cleanupUnconfirmed();
}
