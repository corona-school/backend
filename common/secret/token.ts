import { SecretType } from "../entity/Secret";
import { getUser, getUserTypeORM, User } from "../user";
import { prisma } from "../prisma";
import { v4 as uuid } from "uuid";
import { hashToken } from "../util/hashing";
import * as Notification from "../notification";
import { getLogger } from "log4js";

const logger = getLogger("Token");

export async function revokeToken(user: User, id: number) {
    const result = await prisma.secret.deleteMany({ where: { id, userId: user.userID }});
    if (result.count !== 1) {
        throw new Error(`Failed to revoke token, does not exist`);
    }
}

export async function createToken(user: User) {
    const token = uuid();
    const hash = hashToken(token);

    await prisma.secret.create({
        data: {
            type: SecretType.TOKEN,
            userId: user.userID,
            secret: hash,
            expiresAt: null,
            lastUsed: null
        }
    });
}

export async function requestToken(user: User) {
    const token = uuid();
    const hash = hashToken(token);

    await prisma.secret.create({
        data: {
            type: SecretType.EMAIL_TOKEN,
            userId: user.userID,
            secret: hash,
            expiresAt: null,
            lastUsed: null
        }
    });

    const person = await getUserTypeORM(user.userID);
    await Notification.actionTaken(person, "user-authenticate", { token });
}

export async function loginToken(token: string): Promise<User | never> {
    const secret = await prisma.secret.findFirst({
        where: {
            secret: hashToken(token),
            type: { in: [SecretType.EMAIL_TOKEN, SecretType.TOKEN ]},
            OR: [
                { expiresAt: null },
                { expiresAt: { gte: new Date() }}
            ]
        }
    });

    if (!secret) {
        throw new Error(`Invalid Token`);
    }

    if (secret.type === SecretType.EMAIL_TOKEN) {
        await prisma.secret.delete({ where: { id: secret.id }});
    } else {
        await prisma.secret.update({ data: { lastUsed: new Date() }, where: { id: secret.id }});
    }

    return await getUser(secret.userId);
}