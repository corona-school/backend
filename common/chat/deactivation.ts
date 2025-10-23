import moment from 'moment';
import { markConversationAsReadOnly, sendSystemMessage, updateConversation } from './conversation';
import { countChatParticipants, checkChatMembersAccessRights } from './helper';
import systemMessages from './localization';
import { TJConversation, FinishedReason, SystemMessage } from './types';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import { getLastLecture } from '../courses/lectures';

const logger = getLogger('Chat Deactivation');

// one to one chats (if match) whose match was dissolved 3 days ago should be "disabled" (readonly).
// if the match was dissolved because a deactivated student due to no CoC, we keep it open for 14 days
// if the match was dissolved due to personal issues we disable the chat ASAP
export async function isMatchChatActive(id: number): Promise<boolean> {
    const match = await prisma.match.findUniqueOrThrow({ where: { id } });

    if (!match.dissolved) {
        return true;
    }

    if (match.dissolveReasons.includes('personalIssues')) {
        return false;
    }

    const today = moment().endOf('day');
    if (match.dissolveReasons.includes('accountDeactivatedNoCoC')) {
        const dissolvedAtPlus14Days = moment(match.dissolvedAt).add(14, 'days');
        return !dissolvedAtPlus14Days.isBefore(today);
    }

    const dissolvedAtPlus3Days = moment(match.dissolvedAt).add(3, 'days');
    return !dissolvedAtPlus3Days.isBefore(today);
}

async function isActiveSubcourse(id: number): Promise<boolean> {
    const today = moment().endOf('day');
    const subcourse = await prisma.subcourse.findUniqueOrThrow({ where: { id } });
    const isSubcourseCancelled = subcourse.cancelled;

    // Deliberately keep the chat open after cancellation:
    // if (isSubcourseCancelled) {
    //    return false;
    // }

    const lastLecture = await getLastLecture(subcourse);
    if (!lastLecture) {
        return false;
    }

    const lastLecturePlus30Days = moment(lastLecture.start).add(30, 'days');
    const is30DaysBeforeToday = lastLecturePlus30Days.isBefore(today);

    logger.info(`Checked if Subcourse(${subcourse.id}) is active`, { lastLecture, lastLecturePlus30Days, is30DaysBeforeToday });

    return !is30DaysBeforeToday;
}

export function isConversationReadOnly(conversation: TJConversation) {
    const countParticipants = countChatParticipants(conversation);
    const { readMembers } = checkChatMembersAccessRights(conversation);
    return readMembers.length === countParticipants;
}

function isMatchConversation(conversation: TJConversation) {
    return !!conversation.custom.match;
}

export async function deactivateConversation(conversation: TJConversation) {
    // Prevent users from writing new messages
    await markConversationAsReadOnly(conversation.id);

    // Inform users about the deactivation
    const systemMessage = isMatchConversation(conversation) ? SystemMessage.ONE_ON_ONE_OVER : SystemMessage.GROUP_OVER;
    await sendSystemMessage(systemMessages.de.deactivated, conversation.id, systemMessage);

    // Store the deactivation reason in the Chat, in case we need this somewhen
    await updateConversation({
        id: conversation.id,
        custom: {
            finished: isMatchConversation(conversation) ? FinishedReason.MATCH_DISSOLVED : FinishedReason.COURSE_OVER,
        },
    });

    logger.info('Deactivated Conversation', { conversationId: conversation.id, systemMessage });
}

// Whether a Chat should be deactivated by the background job soon as the corresponding
// match or subcourse ended some time ago
export async function shouldMarkChatAsReadonly(conversation: TJConversation) {
    let shouldMarkAsReadonly = true;

    if (conversation.custom.subcourse) {
        const subcourseIds: number[] = JSON.parse(conversation.custom.subcourse);
        const allSubcoursesActive = await Promise.all(subcourseIds.map((id) => isActiveSubcourse(id)));
        const allInactive = allSubcoursesActive.every((active) => active === false);
        logger.info(`Conversation ${conversation.id} belongs to subcourses which are ${allInactive ? 'all inactive' : 'active'}`, {
            conversationId: conversation.id,
            subcourseIds,
        });
        shouldMarkAsReadonly &&= allInactive;
    }

    if (conversation.custom.prospectSubcourse) {
        const prospectSubcourses: number[] = JSON.parse(conversation.custom.prospectSubcourse);
        const allProspectSubcoursesActive = await Promise.all(prospectSubcourses.map((id) => isActiveSubcourse(id)));
        const allInactive = allProspectSubcoursesActive.every((active) => active === false);
        logger.info(`Conversation ${conversation.id} belongs to subcourses which are all ${allInactive ? 'all inactive' : 'active'}`, {
            conversationId: conversation.id,
            prospectSubcourses,
        });
        shouldMarkAsReadonly &&= allInactive;
    }

    if (conversation.custom.match) {
        const match = JSON.parse(conversation.custom.match);
        const matchId = match.matchId;
        const isMatchActive = await isMatchChatActive(matchId);
        logger.info(`Conversation ${conversation.id} belongs to Match(${matchId}) which is all ${isMatchActive ? 'active' : 'inactive'}`, {
            conversationId: conversation.id,
            matchId,
        });
        shouldMarkAsReadonly &&= !isMatchActive;
    }

    return shouldMarkAsReadonly;
}
