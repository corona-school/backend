import { ConversationDirectionEnum, getAllConversations, markConversationAsReadOnly, sendSystemMessage, updateConversation } from '../../../common/chat';
import { getLogger } from '../../../common/logger/logger';
import { FinishedReason, TJConversation } from '../../../common/chat/types';
import { deactivateConversation, isConversationReadOnly, shouldMarkChatAsReadonly } from '../../../common/chat/deactivation';

const logger = getLogger('FlagOldConversationsAsRO');

export default async function flagInactiveConversationsAsReadonly() {
    const conversationsToFlag: TJConversation[] = [];

    for await (const conversation of getAllConversations()) {
        if (isConversationReadOnly(conversation)) {
            logger.info(`Conversation ${conversation.id} is already readonly.`);
            continue;
        }

        if (conversation.custom?.finished === FinishedReason.REACTIVATE_BY_ADMIN) {
            logger.info(`Converdation ${conversation.id} was reactivated by an admin, do not deactivate again automatically`, {
                conversationId: conversation.id,
            });
            continue;
        }

        if (await shouldMarkChatAsReadonly(conversation)) {
            conversationsToFlag.push(conversation);
        }
    }

    if (conversationsToFlag.length > 0) {
        for (const conversation of conversationsToFlag) {
            await deactivateConversation(conversation);
        }

        logger.info(`Marked ${conversationsToFlag.length} conversations as readonly`);
    } else {
        logger.info('No conversation to mark as readonly');
    }
}
