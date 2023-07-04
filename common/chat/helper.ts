import { match } from '@prisma/client';
import { prisma } from '../prisma';
import { User, getUser, userForPupil, userForStudent } from '../user';
import { getOrCreateChatUser } from './user';
import { sha1 } from 'object-hash';
import { truncate } from 'lodash';
import { createHmac } from 'crypto';
import { Subcourse } from '../../graphql/generated';
import { getPupil, getStudent } from '../../graphql/util';
import { getAllConversations, getConversation, markConversationAsReadOnly, updateConversation } from './conversation';
import { ChatMetaData, Conversation, ConversationInfos, TJConversation } from './types';
import { MatchContactPupil, MatchContactStudent } from './contacts';

type TalkJSUserId = `${'pupil' | 'student'}_${number}`;

const userIdToTalkJsId = (userId: string): TalkJSUserId => {
    return userId.replace('/', '_') as TalkJSUserId;
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

const getMatcheeConversation = async (matchees: { studentId: number; pupilId: number }): Promise<{ conversation: Conversation; conversationId: string }> => {
    const student = await getStudent(matchees.studentId);
    const pupil = await getPupil(matchees.pupilId);
    const studentUser = userForStudent(student);
    const pupilUser = userForPupil(pupil);
    const conversationId = getConversationId([studentUser, pupilUser]);
    const conversation = await getConversation(conversationId);
    return { conversation, conversationId };
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
            console.log(`Teilnehmer mit der ID ${participantId} hat unbekannte Zugriffsrechte.`);
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

    for (const key in conversationInfos.custom) {
        if (conversationInfos.custom.hasOwnProperty(key)) {
            const value = conversationInfos.custom[key];
            convertedConversationInfos.custom[key] = typeof value === 'string' ? value : JSON.stringify(value);
        }
    }

    return convertedConversationInfos;
};

const convertTJConversation = (conversation: TJConversation): Conversation => {
    const { id, subject, topicId, photoUrl, welcomeMessages, custom, lastMessage, participants, createdAt } = conversation;

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
        topicId,
        photoUrl,
        welcomeMessages,
        custom: convertedCustom,
        lastMessage,
        participants,
        createdAt,
    };
};

const removeSubcourseFromConversation = async (subcourse: Subcourse): Promise<void> => {
    const conversationId = subcourse.conversationId;
    const conversation = await getConversation(conversationId);

    if (conversation.custom.subcourse.includes(subcourse.id)) {
        const index = conversation.custom.subcourse.indexOf(subcourse.id);
        conversation.custom.subcourse.splice(index, 1);

        const updatedConversation = {
            id: conversationId,
            custom: conversation.custom,
        };

        await updateConversation(updatedConversation);
    }
};

const removeMatchFromConversation = async (conversation: Conversation): Promise<void> => {
    if (conversation.custom.match) {
        delete conversation.custom.match;

        const updatedConversation = {
            id: conversation.id,
            custom: conversation.custom,
        };

        await updateConversation(updatedConversation);
    }
};

const markPastSubcoursesAsReadOnly = async () => {
    // TODO change to moment
    // TODO check also match
    const prevDay = new Date();
    prevDay.setDate(prevDay.getDate() - 1);

    const conversations = await getAllConversations();

    conversations.data.forEach(async (conversation) => {
        conversation.custom.subcourse.forEach(async (subcourseId) => {
            const subcourse = await prisma.subcourse.findUnique({
                where: { id: subcourseId },
                include: { lecture: true },
            });

            const lectures = subcourse.lecture;

            if (lectures.length > 0) {
                const sortedLectures = lectures.sort((a, b) => {
                    const startA = new Date(a.start);
                    const startB = new Date(b.start);
                    return startA.getTime() - startB.getTime();
                });

                const lastLecture = sortedLectures[sortedLectures.length - 1];
                const prevDay = new Date();

                const endOfLastLecture = new Date(lastLecture.start);
                endOfLastLecture.setMinutes(endOfLastLecture.getMinutes() + lastLecture.duration);

                // TODO + 30 days
                if (endOfLastLecture < prevDay) {
                    await markConversationAsReadOnly(subcourse.conversationId);
                }
            }
        });
    });
};

const markEmptyConversationsAsReadOnly = async () => {
    const conversations = await getAllConversations();
    conversations.data.forEach(async (conversation) => {
        if (!conversation.custom?.match && conversation.custom.subcourse.length === 0) {
            await markConversationAsReadOnly(conversation.id);
        }
    });
};
const isStudentContact = (contact: MatchContactPupil | MatchContactStudent): contact is MatchContactStudent => contact.hasOwnProperty('student');
const isPupilContact = (contact: MatchContactPupil | MatchContactStudent): contact is MatchContactPupil => contact.hasOwnProperty('pupil');

export {
    userIdToTalkJsId,
    parseUnderscoreToSlash,
    checkResponseStatus,
    createChatSignature,
    getMatchByMatchees,
    createOneOnOneId,
    getConversationId,
    getMatcheeConversation,
    checkChatMembersAccessRights,
    removeSubcourseFromConversation,
    removeMatchFromConversation,
    markEmptyConversationsAsReadOnly,
    markPastSubcoursesAsReadOnly,
    isSubcourseParticipant,
    getMembersForSubcourseGroupChat,
    convertConversationInfosToString,
    convertTJConversation,
    isStudentContact,
    isPupilContact,
};
