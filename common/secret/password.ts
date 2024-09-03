import { getUser, getUserByEmail, User } from '../user';
import { prisma } from '../prisma';
import { verifyPassword, hashPassword } from '../util/hashing';
import { secret_type_enum as SecretType } from '@prisma/client';
import { getLogger } from '../logger/logger';

const logger = getLogger('Password');

export async function createPassword(user: User, password: string) {
    const saltedHash = await hashPassword(password);

    await prisma.secret.deleteMany({ where: { userId: user.userID, type: SecretType.PASSWORD } });
    logger.info(`User(${user.userID}) removed previous passwords to set new one`);

    const created = await prisma.secret.create({
        data: {
            type: SecretType.PASSWORD,
            userId: user.userID,
            secret: saltedHash,
            expiresAt: null, // -> never
            lastUsed: new Date(),
        },
    });

    logger.info(`User(${user.userID}) created password Secret(${created.id})`);
}

export async function loginPassword(email: string, password: string): Promise<{ user: User; secretID: number } | never> {
    const user = await getUserByEmail(email, /* active */ true);

    const secrets = await prisma.secret.findMany({
        where: {
            type: SecretType.PASSWORD,
            userId: user.userID,
            OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        },
    });

    for (const secret of secrets) {
        const isValid = await verifyPassword(password, secret.secret);
        if (isValid) {
            await prisma.secret.update({ data: { lastUsed: new Date() }, where: { id: secret.id } });

            logger.info(`User(${user.userID}) successfully logged in with password Secret(${secret.id})`);

            return { user, secretID: secret.id };
        }
    }

    logger.info(`User(${user.userID}) failed to log in with password, ${secrets.length} were checked`);

    throw new Error(`No matching password`);
}
