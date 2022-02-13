import { student as Student, pupil as Pupil } from "@prisma/client";
import { getUser, getUserId } from "../user";
import { prisma } from "../prisma";
import { verifyPassword, hashPassword } from "../util/hashing";
import { SecretType } from "../entity/Secret";

export function createPassword(user: Student | Pupil, password: string) {
    const saltedHash = await hashPassword(password);

    await prisma.$transaction(
        prisma.secret.deleteMany({ userId: getUserId(user), type: SecretType.PASSWORD })
        prisma.secret.insert({ data: {
            type: SecretType.PASSWORD,
            userId: getUserId(user),
            secret: saltedHash
            // expiresAt: NULL -> never
        }})
    );

}

export async function loginPassword(email: string, password: string): Promise<Student | Pupil | never> {
    const user = (
        (await prisma.student.findFirst({ where: { email }})) ??
        (await prisma.pupil.findFirst({ where: { email }}))
    );

    if (!user) {
        throw new Error(`Invalid email`);
    }

    const passwords = await prisma.secret.findMany({ where: { userId: getUserId(user) }});

    for (const password of passwords) {
        const isValid = await verifyPassword(password, password.secret);
        if (isValid) {
            return user;
        }
    }

    throw new Error(`No matching password`);
}