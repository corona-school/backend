import { getLogger } from '../common/logger/logger';
import { prisma } from '../common/prisma';
import { dissolve_reason as DissolveReason, dissolved_by_enum as DissolvedBy } from '@prisma/client';
import moment from 'moment-timezone';

const logger = getLogger();

const dissolveReasonByIndex = (index: number): DissolveReason => {
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
        default:
            return DissolveReason.unknown;
    }
};

/**
 * we only know 0, 1, 5, 6, 7, 8, 9 for sure, the others are ambiguous due to no data on who dissolved the match
 */
export default async function execute() {
    const matches = await prisma.match.findMany({
        where: {
            dissolved: true,
        },
    });
    let knownReason = 0;
    let knownDissolvedBy = 0;
    let unknownReason = 0;
    let unknownDissolvedBy = 0;
    for (const match of matches) {
        const reason = match.dissolveReasonEnum ?? dissolveReasonByIndex(match.dissolveReason);
        logger.info(`Match(${match.id}) has dissolveReason ${reason}`);
        let dissolver: DissolvedBy = DissolvedBy.unknown;
        if (reason == DissolveReason.accountDeactivated) {
            logger.info(`Match(${match.id}) was dissolved due to account deactivation, figuring out who deactivated their account...`);
            const pupil = await prisma.pupil.findUnique({ where: { id: match.pupilId }, select: { active: true, wix_id: true } });
            if (pupil && !pupil.active) {
                const pupilDeactivatedCausingDissolve = await prisma.log.findFirst({
                    where: {
                        logtype: 'deActivate',
                        user: pupil.wix_id,
                        createdAt: {
                            gte: match.dissolvedAt, // match gets dissolved before account deactivation
                            lte: moment(match.dissolvedAt).add(2, 'seconds').toDate(), // add some buffer
                        },
                    },
                });
                if (pupilDeactivatedCausingDissolve) {
                    dissolver = DissolvedBy.pupil;
                    logger.info(`...Pupil(${pupilDeactivatedCausingDissolve.id}) was deactivated, causing the dissolve`);
                }
            }
            if (dissolver === DissolvedBy.unknown) {
                const student = await prisma.student.findUnique({ where: { id: match.studentId }, select: { active: true, wix_id: true } });
                if (student && !student.active) {
                    const studentDeactivatedCausingDissolve = await prisma.log.findFirst({
                        where: {
                            logtype: 'deActivate',
                            user: student.wix_id,
                            createdAt: {
                                gte: match.dissolvedAt, // match gets dissolved before account deactivation
                                lte: moment(match.dissolvedAt).add(2, 'seconds').toDate(), // add some buffer
                            },
                        },
                    });
                    if (studentDeactivatedCausingDissolve) {
                        dissolver = DissolvedBy.student;
                        logger.info(`...Student(${studentDeactivatedCausingDissolve.id}) was deactivated, causing the dissolve`);
                    }
                }
            }
            if (dissolver === DissolvedBy.unknown) {
                logger.info("Couldn't find anyone who deactivated their account...");
            }
        }
        // Only if account deactivation caused match dissolve, we know who the dissolver is

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
    logger.info(`Updated ${knownReason + unknownReason} matches in total, of which:
        - ${knownReason} have an unambiguous dissolveReason
        - ${unknownReason} have an ambiguous dissolveReason (set to 'unknown')
        - ${knownDissolvedBy} have a known dissolver
        - ${unknownDissolvedBy} have an unknown dissolver
    `);
}
