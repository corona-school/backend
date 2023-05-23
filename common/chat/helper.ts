import { match } from '@prisma/client';
import { Match } from '../../graphql/generated';
import { prisma } from '../prisma';
import { User, getUser, getUserTypeAndIdForUserId } from '../user';
import { getOrCreateChatUser } from './user';

const userIdToTalkJsId = (userId: string): string => {
    return userId.replace('/', '_');
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

const createChatSignature = async (user: User): Promise<string> => {
    const userId = (await getOrCreateChatUser(user)).id;
    const crypto = require('crypto');
    const key = process.env.TALKJS_API_KEY;
    const hash = crypto.createHmac('sha256', key).update(userIdToTalkJsId(userId));
    return hash.digest('hex');
};

const getUserIdsForChatParticipants = (participantIds: string[]): [studentId: number, pupilId: number] => {
    let studentId;
    let pupilId;

    participantIds.forEach((participantId) => {
        const [type, id] = getUserTypeAndIdForUserId(participantId);

        if (type === 'student') {
            studentId = id;
        }
        if (type === 'pupil') {
            pupilId = id;
        }
    });

    return [studentId, pupilId];
};
const getUsersForChatParticipants = (participantIds: string[]): [studentId: User, pupilId: User] => {
    let student: User;
    let pupil: User;

    participantIds.forEach(async (participantId) => {
        const [type, id] = getUserTypeAndIdForUserId(participantId);

        if (type === 'student') {
            student = await getUser(participantId);
            console.log('STUD', student);
        }
        if (type === 'pupil') {
            pupil = await getUser(participantId);
            console.log('PUP', pupil);
        }
    });

    return [student, pupil];
};

const getMatchByMatchees = async (matchees: string[]): Promise<match> => {
    const [studentId, pupilId] = getUserIdsForChatParticipants(matchees);

    const match = await prisma.match.findFirstOrThrow({
        where: { AND: [{ studentId: studentId }, { pupilId: pupilId }] },
    });
    return match;
};

export {
    userIdToTalkJsId,
    parseUnderscoreToSlash,
    checkResponseStatus,
    createChatSignature,
    getMatchByMatchees,
    getUserIdsForChatParticipants,
    getUsersForChatParticipants,
};
