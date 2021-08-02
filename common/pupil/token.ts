import { pupil } from "@prisma/client";
import { hashToken } from "../util/hashing";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../prisma";
import { getLogger } from "log4js";

const logger = getLogger("Pupil Token Auth");

export async function refreshToken(pupil: pupil): Promise<string | never> {
    if (pupil.verification !== null) {
        throw new Error("Cannot request access token for Pupil in Verification process");
    }

    if (!pupil.active) {
        throw new Error("Access Token requested by deactivated user");
    }

    const secretToken = uuidv4();
    const hashedToken = hashToken(secretToken);

    await prisma.pupil.update({
        where: { id: pupil.id },
        data: {
            authToken: hashedToken,
            authTokenSent: new Date(),
            authTokenUsed: false
        }
    });

    logger.info(`Created new Auth Token for Pupil(${pupil.id}) with Hash: "${hashedToken}"`);

    return secretToken;
}