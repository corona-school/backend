import { ConversationDirectionEnum, getAllConversations, markConversationAsReadOnly, sendSystemMessage, updateConversation } from '../../../common/chat';
import { getLogger } from '../../../common/logger/logger';
import { TJConversation } from '../../../common/chat/types';
import { deactivateConversation, isConversationReadOnly, shouldMarkChatAsReadonly } from '../../../common/chat/deactivation';

const logger = getLogger('FlagOldConversationsAsRO');

async function paginateConversations(orderDirection: ConversationDirectionEnum) {
    let startingAfter: string = undefined;
    const conversationsToFlag: TJConversation[] = [];

    do {
        const conversations = await getAllConversations(orderDirection, startingAfter);
        for (const conversation of conversations) {
            if (isConversationReadOnly(conversation)) {
                logger.info(`Conversation ${conversation.id} is already readonly.`);
                continue;
            }

            if (await shouldMarkChatAsReadonly(conversation)) {
                conversationsToFlag.push(conversation);
            }
        }

        startingAfter = conversations[conversations.length - 1]?.id;
    } while (startingAfter);

    return conversationsToFlag;
}

export default async function flagInactiveConversationsAsReadonly() {
    const conversationsToFlag = await paginateConversations(ConversationDirectionEnum.ASC);

    if (conversationsToFlag.length > 0) {
        for (const conversation of conversationsToFlag) {
            await deactivateConversation(conversation);
        }

        logger.info(`Marked ${conversationsToFlag.length} conversations as readonly`);
    } else {
        logger.info('No conversation to mark as readonly');
    }
}
