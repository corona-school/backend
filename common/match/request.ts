import { pupil as Pupil } from "@prisma/client";
import { getLogger } from "log4js";
import { prisma } from "../prisma";

const logger = getLogger("Match");

export async function createMatchRequest(pupil: Pupil, adminOverride = false) {
    const matchCount = await prisma.match.count({ where: { pupilId: pupil.id }});

    if (!adminOverride && (pupil.openMatchRequestCount > 0 || matchCount > 0)) {
        throw new Error(`Cannot create another match request for Pupil(${pupil.id}) as the pupil already has either an open match request or a match. An Admin can bypass that`);
    }

    const result = await prisma.pupil.update({
        where: { id: pupil.id },
        data: { openMatchRequestCount: { increment: 1 } }
    });

    logger.info(`Created match request for Pupil(${pupil.id}), now has ${result.openMatchRequestCount} requests, was admin: ${adminOverride}`);
}

export async function deleteMatchRequest(pupil: Pupil) {
    if (pupil.openMatchRequestCount <= 0) {
        throw new Error(`Cannot delete match request for Pupil(${pupil.id}) as pupil has no request left`);
    }

    const result = await prisma.pupil.update({
        where: { id: pupil.id },
        data: { openMatchRequestCount: { decrement: 1 } }
    });

    logger.info(`Deleted match request for pupil, now has ${result.openMatchRequestCount} requests`);
}