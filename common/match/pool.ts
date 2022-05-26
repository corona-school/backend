import { prisma } from "../prisma";
import type { Prisma, pupil as Pupil, student as Student } from "@prisma/client";
import { Helpee, Helper, match, Settings, Match as MatchResult, SubjectWithGradeRestriction } from "corona-school-matching";
import { createMatch } from "./create";
import { parseSubjectString, Subject } from "../util/subjectsutils";
import { gradeAsInt } from "../util/gradestrings";
import { assertExists } from "../util/basic";
import { DEFAULT_TUTORING_GRADERESTRICTIONS } from "../entity/Student";
import { getLogger } from "log4js";
import { isDev } from "../util/environment";

const logger = getLogger("MatchingPool");

/* A MatchPool is a Set of students and a Set of pupils,
    which can then be matched to a Set of matches */
export interface MatchPool<Toggle extends string = string> {
    name: string;
    studentsToMatch: (toggles: Toggle[]) => Prisma.studentWhereInput;
    pupilsToMatch: (toggles: Toggle[]) => Prisma.pupilWhereInput;
    settings: Settings;
    createMatch(pupil: Pupil, student: Student, pool: MatchPool): Promise<void | never>;
    toggles: Toggle[]
    // if present, the matching is run automatically on a daily basis if the criteria are matched
    automatic?: {
        minStudents: number;
        minPupils: number;
    }
}

const getViableUsers = (toggles: string[]) => {
    const viableUsers: Prisma.studentWhereInput & Prisma.pupilWhereInput = {
        active: true
    };

    if (!toggles.includes("allow-unverified")) {
        viableUsers.verification = null; // require verification to be unset
    }

    /* On production we want to avoid that our testusers test+prod-...@lern-fair.de
    are accidentally matched to real users */
    if (!isDev) {
        viableUsers.email = { not: { startsWith: "test", endsWith: "@lern-fair.de" }};
    }

    return viableUsers;
};

export async function getStudents(pool: MatchPool, toggles: string[], take?: number, skip?: number) {
    return await prisma.student.findMany({
        where: { ...getViableUsers(toggles), ...pool.studentsToMatch(toggles) },
        take, skip
    });
}

export async function getPupils(pool: MatchPool, toggles: string[], take?: number, skip?: number) {
    return await prisma.pupil.findMany({
        where: { ...getViableUsers(toggles), ...pool.pupilsToMatch(toggles) },
        take, skip
    });
}

export async function getStudentCount(pool: MatchPool, toggles: string[]) {
    return await prisma.student.count({
        where: { ...getViableUsers(toggles), ...pool.studentsToMatch(toggles) }
    });
}

export async function getPupilCount(pool: MatchPool, toggles: string[]) {
    return await prisma.pupil.count({
        where: { ...getViableUsers(toggles), ...pool.pupilsToMatch(toggles) }
    });
}

async function studentToHelper(student: Student): Promise<Helper> {
    const existingMatches = await prisma.match.findMany({ select: { pupil: { select: { wix_id: true } } }, where: { studentId: student.id }});

    return {
        id: student.id,
        uuid: student.wix_id,
        matchRequestCount: student.openMatchRequestCount,
        subjects: parseSubjectString(student.subjects).map(formattedSubjectToSubjectWithGradeRestriction),
        createdAt: student.createdAt,
        excludeMatchesWith: existingMatches.map(it => ({ uuid: it.pupil.wix_id })),
        state: student.state
    };
}

async function pupilToHelpee(pupil: Pupil): Promise<Helpee> {
    const existingMatches = await prisma.match.findMany({ select: { student: { select: { wix_id: true } } }, where: { pupilId: pupil.id }});

    return {
        id: pupil.id,
        uuid: pupil.wix_id,
        matchRequestCount: pupil.openMatchRequestCount,
        subjects: parseSubjectString(pupil.subjects),
        createdAt: pupil.createdAt,
        excludeMatchesWith: existingMatches.map(it => ({ uuid: it.student.wix_id })),
        state: pupil.state,
        matchingPriority: pupil.matchingPriority,
        grade: gradeAsInt(pupil.grade)
    };
}

function formattedSubjectToSubjectWithGradeRestriction(subject: Subject): SubjectWithGradeRestriction {
    return {
        name: subject.name,
        gradeRestriction: {
            min: subject.grade?.min ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MIN, //due to a screening tool's bug (or how it is designed), those values may be null (which causes the algorithm to fail)
            max: subject.grade?.max ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MAX
        }
    };
}

const balancingCoefficients = {
    subjectMatching: 0.65,
    state: 0.05,
    waitingTime: 0.2,
    matchingPriority: 0.1
};

export const pools: MatchPool[] = [
    {
        name: "lern-fair-now",
        toggles: ["skip-interest-confirmation"],
        pupilsToMatch: (toggles) => {
            const query: Prisma.pupilWhereInput = {
                isPupil: true,
                openMatchRequestCount: { gt: 0 },
                subjects: { not: "[]"},
                registrationSource: { notIn: ["plus"] }
            };

            if (!toggles.includes("skip-interest-confirmation")) {
                query.OR = [
                    { registrationSource: "cooperation" },
                    { pupil_tutoring_interest_confirmation_request: { status: "confirmed" }}
                ];
            }
            return query;
        },
        studentsToMatch: (toggles) => ({
            isStudent: true,
            openMatchRequestCount: { gt: 0},
            subjects: { not: "[]" },
            screening: { success: true },
            registrationSource: { notIn: ["plus"]}
        }),
        createMatch,
        settings: { balancingCoefficients }
    },
    {
        name: "lern-fair-plus",
        toggles: ["allow-unverified"],
        pupilsToMatch: (toggles) => ({
            isPupil: true,
            openMatchRequestCount: { gt: 0 },
            subjects: { not: "[]"},
            registrationSource: { equals: "plus" }
        }),
        studentsToMatch: (toggles) => ({
            isStudent: true,
            openMatchRequestCount: { gt: 0},
            subjects: { not: "[]" },
            screening: { success: true },
            registrationSource: { equals: "plus" }
        }),
        createMatch,
        settings: { balancingCoefficients }
    },
    {
        name: "TEST-DO-NOT-USE",
        toggles: ["allow-unverified"],
        pupilsToMatch: (toggles) => ({
            isPupil: true,
            openMatchRequestCount: { gt: 0 }
        }),
        studentsToMatch: (toggles) => ({
            isStudent: true,
            openMatchRequestCount: { gt: 0 }
        }),
        createMatch(pupil, student) {
            if (!isDev) {
                throw new Error(`The Test Pool may not be run in production!`);
            }
            return createMatch(pupil, student, this);
        },
        settings: { balancingCoefficients }
    }
];

export async function getPoolRuns(pool: MatchPool) {
    return await prisma.match_pool_run.findMany({ where: { matchingPool: pool.name }});
}

export async function runMatching(poolName: string, apply: boolean, toggles: string[]) {
    const pool = pools.find(it => it.name === poolName);
    if (!pool) {
        throw new Error(`Unknown Pool '${poolName}'`);
    }

    const invalidToggles = toggles.filter(it => !pool.toggles.includes(it));
    if (invalidToggles.length > 0) {
        throw new Error(`Unknown toggles ${invalidToggles} for pool '${pool.name}'`);
    }

    logger.info(`MatchingPool(${pool.name}) started matching (apply: ${apply}, toggles: ${toggles})`);

    const timing = { preparation: 0, matching: 0, commit: 0 };

    const startPreparation = Date.now();
    const pupils = await getPupils(pool, toggles);
    const students = await getStudents(pool, toggles);

    // The matching algorithm works on it's own entities, but we need to map them back to pupils and students when receiving the result
    const pupilsMap = new Map(pupils.map(it => [it.wix_id, it]));
    const studentsMap = new Map(students.map(it => [it.wix_id, it]));

    const helpers: Helper[] = await Promise.all(students.map(studentToHelper));
    const helpees: Helpee[] = await Promise.all(pupils.map(pupilToHelpee));

    timing.preparation = Date.now() - startPreparation;
    logger.info(`MatchingPool(${pool.name}) found ${pupils.length} pupils and ${students.length} students for matching in ${timing.preparation}ms`);

    const startMatching = Date.now();
    const result = match(helpers, helpees, pool.settings);

    const matches = result.matches.map(it => ({
        student: assertExists(studentsMap.get(it.helper.uuid)),
        pupil: assertExists(pupilsMap.get(it.helpee.uuid))
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

        await prisma.match_pool_run.create({ data: {
            matchingPool: pool.name,
            matchesCreated: matches.length,
            stats
        }});
    }

    return {
        timing,
        stats,
        matches
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