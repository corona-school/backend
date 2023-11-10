import { match } from '@prisma/client';
import { prisma } from '../prisma';
import { User, getUser } from '../user';
import { sha1 } from 'object-hash';
import { truncate } from 'lodash';
import { Subcourse } from '../../graphql/generated';
import { ChatMetaData, Conversation, ConversationInfos, TJConversation } from './types';
import { type MatchContactPupil, type MatchContactStudent } from './contacts';

type TalkJSUserId = `${'pupil' | 'student'}_${number}`;
export type UserId = `${'pupil' | 'student'}/${number}`;

const userIdToTalkJsId = (userId: string): TalkJSUserId => {
    return userId.replace('/', '_') as TalkJSUserId;
};

const talkJsIdToUserId = (userId: string): UserId => {
    return userId.replace('_', '/') as UserId;
};

function createOneOnOneId(userA: User, userB: User): string {
    const userIds = JSON.stringify([userA.userID, userB.userID].sort());
    const hashedIds = sha1(userIds);
    return truncate(hashedIds, { length: 10 });
}

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

const isSubcourseParticipant = async (participants: string[]): Promise<boolean> => {
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

const getMembersForSubcourseGroupChat = async (subcourse: Subcourse) => {
    const subcourseParticipants = subcourse.subcourse_participants_pupil;
    const subcourseInstructors = subcourse.subcourse_instructors_student;

    const members = await Promise.all(
        subcourseParticipants.map(async (participant) => {
            const { pupilId } = participant;
            const user = await getUser(`pupil/${pupilId}`);
            return user;
        })
    );

    await Promise.all(
        subcourseInstructors.map(async (instructor) => {
            const { studentId } = instructor;
            const instructorUser = await getUser(`student/${studentId}`);
            members.push(instructorUser);
        })
    );

    return members;
};

const countChatParticipants = (conversation: Conversation): number => {
    return Object.keys(conversation.participants).length;
};

const checkChatMembersAccessRights = (conversation: Conversation): { readWriteMembers: string[]; readMembers: string[] } => {
    const readWriteMembers: string[] = [];
    const readMembers: string[] = [];

    for (const participantId in conversation.participants) {
        const participant = conversation.participants[participantId];
        const access = participant.access;

        if (access === 'ReadWrite') {
            readWriteMembers.push(participantId);
        } else if (access === 'Read') {
            readMembers.push(participantId);
        } else {
            throw new Error(`Teilnehmer mit der ID ${participantId} hat unbekannte Zugriffsrechte auf die Conversation ${conversation.id}.`);
        }
    }
    return { readWriteMembers, readMembers };
};

const convertConversationInfosToString = (conversationInfos: ConversationInfos): ConversationInfos => {
    const convertedConversationInfos: ConversationInfos = {
        subject: conversationInfos.subject,
        photoUrl: conversationInfos.photoUrl,
        welcomeMessages: conversationInfos.welcomeMessages,
        custom: {} as ChatMetaData,
    };

    for (const key of Object.keys(conversationInfos.custom)) {
        const value = conversationInfos.custom[key];
        convertedConversationInfos.custom[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }

    return convertedConversationInfos;
};

const convertTJConversation = (conversation: TJConversation): Conversation => {
    const { id, subject, photoUrl, welcomeMessages, custom, lastMessage, participants, createdAt } = conversation;

    const convertedCustom: ChatMetaData = custom
        ? {
              ...(custom.start && { start: custom.start }),
              ...(custom.match && { match: { matchId: parseInt(custom.match) } }),
              ...(custom.subcourse && { subcourse: custom.subcourse.split(',').map(Number) }),
              ...(custom.prospectSubcourse && { prospectSubcourse: custom.prospectSubcourse.split(',').map(Number) }),
              ...(custom.finished && { finished: custom.finished }),
          }
        : {};

    return {
        id,
        subject,
        photoUrl,
        welcomeMessages,
        custom: convertedCustom,
        lastMessage,
        participants,
        createdAt,
    };
};

const isStudentContact = (contact: MatchContactPupil | MatchContactStudent): contact is MatchContactStudent =>
    Object.prototype.hasOwnProperty.call(contact, 'student');
const isPupilContact = (contact: MatchContactPupil | MatchContactStudent): contact is MatchContactPupil =>
    Object.prototype.hasOwnProperty.call(contact, 'pupil');

export {
    userIdToTalkJsId,
    talkJsIdToUserId,
    parseUnderscoreToSlash,
    checkResponseStatus,
    getMatchByMatchees,
    createOneOnOneId,
    countChatParticipants,
    checkChatMembersAccessRights,
    isSubcourseParticipant,
    getMembersForSubcourseGroupChat,
    convertConversationInfosToString,
    convertTJConversation,
    isStudentContact,
    isPupilContact,
};
