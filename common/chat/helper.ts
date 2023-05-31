import { match } from '@prisma/client';
import { prisma } from '../prisma';
import { User, getUser } from '../user';
import { getOrCreateChatUser } from './user';
import { sha1 } from 'object-hash';
import { truncate } from 'lodash';
import { createHmac } from 'crypto';

const userIdToTalkJsId = (userId: string): string => {
    return userId.replace('/', '_');
};
const createChatSignature = async (user: User): Promise<string> => {
    const userId = (await getOrCreateChatUser(user)).id;
    const key = process.env.TALKJS_API_KEY;
    const hash = createHmac('sha256', key).update(userIdToTalkJsId(userId));
    return hash.digest('hex');
};

function createOneOnOneId(userA: User, userB: User): string {
    const userIds = JSON.stringify([userA.userID, userB.userID].sort());
    const hashedIds = sha1(userIds);
    return truncate(hashedIds, { length: 10 });
}

const getConversationId = (participants: User[]) => {
    const conversationId = createOneOnOneId(participants[0], participants[1]);
    return conversationId;
};

const parseUnderscoreToSlash = (id: string): string => {
    return id.replace('_', '/');
};

const checkResponseStatus = async (response: Response): Promise<void> => {
    if (response.status !== 200) {
        const errorMessage = await response.json();
        throw new Error(`Request failed, due to ${JSON.stringify(errorMessage)}`);
    }
};

const getMatchByMatchees = async (matchees: string[]): Promise<match> => {
    let studentId: number;
    let pupilId: number;

    await Promise.all(
        matchees.map(async (matchee) => {
            const user = await getUser(matchee);
            if (user.studentId) {
                studentId = user.studentId;
            }
            if (user.pupilId) {
                pupilId = user.pupilId;
            }
        })
    );
    const match = await prisma.match.findFirstOrThrow({
        where: { AND: [{ studentId: studentId }, { pupilId: pupilId }] },
    });

    return match;
};

const checkIfSubcourseParticipation = async (participants: string[]): Promise<boolean> => {
    const participantUser = participants.map(async (participant) => {
        const user = await getUser(participant);
        return user;
    });

    const users = await Promise.all(participantUser);
    const studentIds = users.filter((user) => user.studentId).map((user) => user.studentId);
    const pupilIds = users.filter((user) => user.pupilId).map((user) => user.pupilId);

    const result = await prisma.subcourse.findMany({
        where: {
            AND: [
                {
                    subcourse_instructors_student: {
                        some: { studentId: { in: studentIds } },
                    },
                },
                {
                    subcourse_participants_pupil: {
                        some: { pupilId: { in: pupilIds } },
                    },
                },
            ],
        },
    });

    return result.length > 0;
};

export {
    userIdToTalkJsId,
    parseUnderscoreToSlash,
    checkResponseStatus,
    createChatSignature,
    getMatchByMatchees,
    createOneOnOneId,
    getConversationId,
    checkIfSubcourseParticipation,
};