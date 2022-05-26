import { User } from "../user";
// import { secret as Secret } from "@prisma/client";
import { prisma } from "../prisma";
import { getLogger } from "log4js";

export * from "./password";
export * from "./token";

const logger = getLogger("Secret");

export async function getSecrets(user: User): Promise<{}[]> {
    /* const result = await prisma.secret.findMany({
        where: {
            userId: user.userID,
            OR: [
                { expiresAt: null },
                { expiresAt: { gte: new Date() }}
            ]
        },
        select: { createdAt: true, expiresAt: true, id: true, lastUsed: true, type: true, userId: true }
    });

    logger.info(`User(${user.userID}) retrieved ${result.length} secrets`);
    return result; */
    throw new Error(`temp`)
}

export async function cleanupSecrets() {
    /* const result = await prisma.secret.deleteMany({
        where: {
            expiresAt: { lte: new Date() }
        }
    });

    logger.info(`Cleaned up ${result.count} expired secrets`); */
    throw new Error(`temp`)
}