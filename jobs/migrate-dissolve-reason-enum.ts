import { getLogger } from '../common/logger/logger';
import { prisma } from '../common/prisma';
import { dissolve_reason as DissolveReason, dissolved_by_enum as DissolvedBy } from '@prisma/client';

const logger = getLogger();

const dissolveReasonByIndex = (index: number, dissolvedBy: DissolvedBy): DissolveReason => {
    switch (index) {
        case -1:
            return DissolveReason.noMoreHelpNeeded;
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

const mapDissolver = (input: string) => {
    if (input === 'student') {
        return DissolvedBy.student;
    } else if (input === 'pupil') {
        return DissolvedBy.pupil;
    } else {
        return DissolvedBy.unknown;
    }
};

/**
 * we only know 0, 1, 5, 6, 7, 8, 9 for sure, the others are ambiguous due to no data on who dissolved the match
 */
export default async function execute() {
    const data: {
        matchId: number;
        logDate: Date;
        userType: 'student' | 'pupil' | 'unknown';
        dissolveReason: number;
    }[] = await prisma.$queryRaw`
    SELECT (log.data::json->>'matchId')::int as "matchId", log."createdAt" as "logDate",
                                                  CASE
                                                      WHEN student.id IS NOT NULL THEN 'student'
                                                      WHEN pupil.id IS NOT NULL THEN 'pupil'
                                                      ELSE 'unknown'
                                                      END AS "userType",
                                                  match."dissolveReason"
    FROM log
           LEFT JOIN student ON student.wix_id = log."user"
           LEFT JOIN pupil ON pupil.wix_id = log."user"
           JOIN match ON log.data::json->>'matchId' = match.id::text
    WHERE logtype = 'matchDissolve' AND
      "user" IS DISTINCT FROM 'unknown' AND
          match.dissolved = True AND
          match."dissolvedBy" = 'unknown' AND
          match."dissolveReasonEnum" = 'unknown' AND
          (match."dissolvedAt" > log."createdAt" - interval '1 minute' AND /* Avoid setting wrong dissolver if match was reactivated at some point */
           match."dissolvedAt" < log."createdAt" + interval '1 minute') AND
      (student.id IS NOT NULL OR pupil.id IS NOT NULL)
    ORDER BY log."createdAt" DESC`;
    console.log(data);
    let knownReason = 0;
    let knownDissolvedBy = 0;
    let unknownReason = 0;
    let unknownDissolvedBy = 0;
    for (const match of data) {
        const dissolver: DissolvedBy = mapDissolver(match.userType);
        const reason = dissolveReasonByIndex(match.dissolveReason, dissolver);
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

        logger.info(`Match(${match.matchId}): Setting reason=${reason}, dissolver=${dissolver}`);
        await prisma.match.update({
            where: {
                id: match.matchId,
            },
            data: {
                dissolveReasonEnum: reason,
                dissolvedBy: dissolver,
            },
        });
    }
    logger.info(`Found ${data.length} matches with unknown dissolver/dissolveReasonEnum.
        - ${knownReason} now have a known dissolvedReason.
        - We now know the dissolver for ${knownDissolvedBy} matches.
        - ${unknownDissolvedBy} matches still have an unknown dissolver.
        - ${unknownReason} matches still have an unknown reason.
    `);
}
