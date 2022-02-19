import { getUser, getUserByEmail, User } from "../user";
import { prisma } from "../prisma";
import { verifyPassword, hashPassword } from "../util/hashing";
import { SecretType } from "../entity/Secret";
import { getLogger } from "log4js";

const logger = getLogger("Token");

export async function createPassword(user: User, password: string) {
    const saltedHash = await hashPassword(password);

    await prisma.secret.deleteMany({ where: { userId: user.userID, type: SecretType.PASSWORD }}),
    await prisma.secret.create({ data: {
        type: SecretType.PASSWORD,
        userId: user.userID,
        secret: saltedHash,
        expiresAt: null, // -> never
        lastUsed: null
    }});

}

export async function loginPassword(email: string, password: string): Promise<User | never> {
    const user = await getUserByEmail(email);

    const secrets = await prisma.secret.findMany({
        where: {
            type: SecretType.PASSWORD,
            userId: user.userID,
            OR: [
                { expiresAt: null },
                { expiresAt: { gte: new Date() }}
            ]
        }});

    for (const secret of secrets) {
        const isValid = await verifyPassword(password, secret.secret);
        if (isValid) {
            return user;
        }
    }

    throw new Error(`No matching password`);
}