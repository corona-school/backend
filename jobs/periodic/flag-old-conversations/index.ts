import moment from 'moment';
import { getMatch, getSubcourse } from '../../../graphql/util';
import { getAllConversations, markConversationAsReadOnly, sendSystemMessage, updateConversation } from '../../../common/chat';
import { getLogger } from '../../../common/logger/logger';
import { Lecture } from '../../../graphql/generated';
import { FinishedReason, SystemMessage, TJConversation } from '../../../common/chat/types';
import systemMessages from '../../../common/chat/localization';
import { checkChatMembersAccessRights, countChatParticipants } from '../../../common/chat/helper';

const logger = getLogger('FlagOldConversationsAsRO');

enum ConversationType {
    GROUP = 'group',
    ONE_ON_ONE = 'one_on_one',
}

type conversationsToDeactivate = {
    id: string;
    conversationType: ConversationType;
};

// one to one chats (if match) whose match was dissolved 30 days ago should be "disabled" (readonly).
// This will allow users to continue writing for another 30 days after match disolving.
async function isActiveMatch(id: number): Promise<boolean> {
    const today = moment().endOf('day');
    const match = await getMatch(id);
    const dissolvedAtPlus30Days = moment(match.dissolvedAt).add(30, 'days');
    return !dissolvedAtPlus30Days.isBefore(today);
}

async function isActiveSubcourse(id: number): Promise<boolean> {
    const today = moment().endOf('day');
    const subcourse = await getSubcourse(id, true);
    const isSubcourseCancelled = subcourse.cancelled;

    if (isSubcourseCancelled) {
        return false;
    }

    const lastLecutre = subcourse.lecture.sort((a: Lecture, b: Lecture) => moment(a.start).milliseconds() - moment(b.start).milliseconds()).pop();
    const lastLecturePlus30Days = moment(lastLecutre.start).add(30, 'days');
    const is30DaysBeforeToday = lastLecturePlus30Days.isBefore(today);
    return !is30DaysBeforeToday;
}

function isConversationReadOnly(conversation: TJConversation) {
    const countParticipants = countChatParticipants(conversation);
    const { readMembers } = checkChatMembersAccessRights(conversation);
    return readMembers.length === countParticipants;
}

async function finishConversation(convo: conversationsToDeactivate, finishReason: FinishedReason, systemMessageType: SystemMessage) {
    const updateConversationInfo = {
        id: convo.id,
        custom: {
            finished: finishReason,
        },
    };

    await sendSystemMessage(systemMessages.de.deactivated, convo.id, systemMessageType);
    await updateConversation(updateConversationInfo);

    logger.info('Mark conversation as readonly', { conversationId: convo.id, conversationType: convo.conversationType });
}

async function paginateConversations(orderDirection: 'ASC' | 'DESC') {
    let startingAfter: string = undefined;
    const conversationsToFlag: conversationsToDeactivate[] = [];

    do {
        const conversationsResponse = await getAllConversations(orderDirection, startingAfter);
        const conversations = conversationsResponse.data;

        for (const conversation of conversations) {
            let shouldMarkAsReadonly = true;

            if (isConversationReadOnly(conversation)) {
                logger.info(`Conversation ${conversation.id} is already readonly.`);
                continue;
            }

            if (conversation.custom.subcourse) {
                const subcourseIds: number[] = JSON.parse(conversation.custom.subcourse);
                const allSubcoursesActive = await Promise.all(subcourseIds.map((id) => isActiveSubcourse(id)));
                const allInactive = allSubcoursesActive.every((active) => active === false);
                logger.info(`Conversation ${conversation.id} belongs to subcourses which are ${allInactive ? 'all inactive' : 'active'}`, {
                    conversationId: conversation.id,
                });
                shouldMarkAsReadonly &&= allInactive;
            }

            if (conversation.custom.prospectSubcourse) {
                const prospectSubcourses: number[] = JSON.parse(conversation.custom.prospectSubcourse);
                const allProspectSubcoursesActive = await Promise.all(prospectSubcourses.map((id) => isActiveSubcourse(id)));
                const allInactive = allProspectSubcoursesActive.every((active) => active === false);
                logger.info(`Conversation ${conversation.id} belongs to subcourses which are all ${allInactive ? 'all inactive' : 'active'}`, {
                    conversationId: conversation.id,
                });
                shouldMarkAsReadonly &&= allInactive;
            }

            if (conversation.custom.match) {
                const match = JSON.parse(conversation.custom.match);
                const matchId = match.matchId;
                const isMatchActive = await isActiveMatch(matchId);
                logger.info(`Conversation ${conversation.id} belongs to Match(${matchId}) which is all ${isMatchActive ? 'active' : 'inactive'}`, {
                    conversationId: conversation.id,
                    matchId,
                });
                shouldMarkAsReadonly &&= !isMatchActive;
            }

            if (shouldMarkAsReadonly) {
                conversationsToFlag.push({
                    id: conversation.id,
                    conversationType: conversation.custom.match ? ConversationType.ONE_ON_ONE : ConversationType.GROUP,
                });
            }
        }

        startingAfter = conversations[conversations.length - 1]?.id;
    } while (startingAfter);

    return conversationsToFlag;
}

export default async function flagInactiveConversationsAsReadonly() {
    const conversationsToFlag = await paginateConversations('ASC');

    if (conversationsToFlag.length > 0) {
        for (const convo of conversationsToFlag) {
            await markConversationAsReadOnly(convo.id);
            if (convo.conversationType === ConversationType.ONE_ON_ONE) {
                await finishConversation(convo, FinishedReason.MATCH_DISSOLVED, SystemMessage.ONE_ON_ONE_OVER);
            } else {
                await finishConversation(convo, FinishedReason.COURSE_OVER, SystemMessage.GROUP_OVER);
            }
            logger.info('Mark converstation as readonly', { conversationId: convo.id, conversationType: convo.conversationType });
        }
    } else {
        logger.info('No conversation to mark as readonly');
    }
}
