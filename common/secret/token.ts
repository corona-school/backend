import { SecretType } from "../entity/Secret";
import { getUserId } from "../user";
import { prisma } from "../prisma";
import { v4 as uuid } from "uuid";
import { hashToken } from "../util/hashing";
import * as Notification from "../notification";

async function revokeToken(user: User, id: number) {
    await prisma.secret.deleteOne({ where: { id, userId: getUserId(user) }});
}

async function createToken(user: User) {
    const token = uuid();
    const hash = hashToken(token);

    await prisma.secret.insert({
        data: {
            type: SecretType.TOKEN,
            userId: getUserId(user),
            secret: hash
        }
    });
}

async function requestToken(user: User) {
    const token = uuid();
    const hash = hashToken(token);

    await prisma.secret.insert({
        data: {
            type: SecretType.EMAIL_TOKEN,
            userId: getUserId(user),
            secret: hash
        }
    });

    await Notification.actionTaken("user-authenticate", user, { token });
}

async function loginToken(user: User) {

}