import { getLogger } from '../common/logger/logger';
import { prisma } from '../common/prisma';
import { dissolve_reason as DissolveReason, dissolved_by_enum as DissolvedBy } from '@prisma/client';
import moment from 'moment-timezone';
import { getUserTypeAndIdForUserId } from '../common/user';

const logger = getLogger();

const dissolveReasonByIndex = (index: number, dissolvedBy: DissolvedBy): DissolveReason => {
    switch (index) {
        case 0:
            return DissolveReason.accountDeactivated;
        case 1:
            return DissolveReason.ghosted;
        case 5:
            return DissolveReason.personalIssues;
        case 6:
            return DissolveReason.scheduleIssues;
        case 7:
            return DissolveReason.technicalIssues;
        case 8:
            return DissolveReason.other;
        case 9:
            return DissolveReason.languageIssues;
        default: {
            if (dissolvedBy == DissolvedBy.pupil) {
                switch (index) {
                    case 2:
                        return DissolveReason.isOfNoHelp;
                    case 3:
                        return DissolveReason.noMoreTime;
                    case 4:
                        return DissolveReason.noMoreHelpNeeded;
                }
            } else if (dissolvedBy == DissolvedBy.student) {
                switch (index) {
                    case 2:
                        return DissolveReason.noMoreHelpNeeded;
                    case 3:
                        return DissolveReason.isOfNoHelp;
                    case 4:
                        return DissolveReason.noMoreTime;
                }
            }
            return DissolveReason.unknown;
        }
    }
};

/**
 * we only know 0, 1, 5, 6, 7, 8, 9 for sure, the others are ambiguous due to no data on who dissolved the match
 */
export default async function execute() {
    const matches = await prisma.match.findMany({
        where: {
            dissolved: true,
            OR: [
                // let's find the dissolved matches for which we haven't been able to find a dissolveReason or dissolver yet.
                {
                    dissolveReasonEnum: DissolveReason.unknown,
                },
                {
                    dissolvedBy: DissolvedBy.unknown,
                },
            ],
        },
    });
    // Gather all matchDissolve logs where a user was specified.
    const dissolveLogs = await prisma.log.findMany({
        where: {
            logtype: 'matchDissolve',
            NOT: {
                OR: [
                    {
                        user: null,
                    },
                    {
                        user: 'unknown', // logTransaction sets this if wix id is undefined
                    },
                ],
            },
        },
        orderBy: {
            createdAt: 'asc', // in case there are multiple dissolve logs for a match, we'd put the last one in the map
        },
    });

    const dissolvers = new Map<number, DissolvedBy>(); // matchId -> DissolvedBy
    for (const log of dissolveLogs) {
        const data = JSON.parse(log.data);
        if (data) {
            const matchId = data.matchId;
            if (matchId) {
                try {
                    const [type, _] = getUserTypeAndIdForUserId(log.user);
                    if (type == 'pupil') {
                        dissolvers[matchId] = DissolvedBy.pupil;
                    } else if (type == 'student') {
                        dissolvers[matchId] = DissolvedBy.student;
                    } else if (type == 'screener') {
                        dissolvers[matchId] = DissolvedBy.admin;
                    }
                } catch {
                    continue;
                }
            }
        }
    }

    let knownReason = 0;
    let knownDissolvedBy = 0;
    let unknownReason = 0;
    let unknownDissolvedBy = 0;
    for (const match of matches) {
        const dissolver: DissolvedBy = dissolvers[match.id] ?? DissolvedBy.unknown;
        const reason = dissolveReasonByIndex(match.dissolveReason, dissolver) ?? DissolveReason.unknown;
        if (dissolver === DissolvedBy.unknown && reason === DissolveReason.unknown) {
            // continue, can't update anyways
            unknownDissolvedBy++;
            unknownReason++;
            continue;
        }

        if (reason === DissolveReason.unknown) {
            unknownReason++;
        } else {
            knownReason++;
        }

        if (dissolver === DissolvedBy.unknown) {
            unknownDissolvedBy++;
        } else {
            knownDissolvedBy++;
        }

        logger.info(`Match(${match.id}): Setting reason=${reason}, dissolver=${dissolver}`);
        await prisma.match.update({
            where: {
                id: match.id,
            },
            data: {
                dissolveReasonEnum: reason,
                dissolvedBy: dissolver,
            },
        });
    }
    logger.info(`Found ${matches.length} matches with unknown dissolver/dissolveReasonEnum. Map of matchId -> dissolvedBy has ${dissolvers.size} entries.
        - ${knownReason} now have a known dissolvedReason.
        - We now know the dissolver for ${knownDissolvedBy} matches.
        - ${unknownDissolvedBy} matches still have an unknown dissolver.
        - ${unknownReason} matches still have an unknown reason.
    `);
}
