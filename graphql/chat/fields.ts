import { Authorized, FieldResolver, ObjectType, Resolver, Root } from 'type-graphql';
import { isConversationReadOnly, shouldMarkChatAsReadonly } from '../../common/chat/deactivation';
import { TJConversation } from '../../common/chat/types';
import { Role } from '../roles';
import { getConversation } from '../../common/chat';

@ObjectType()
export class Chat {
    conversation: TJConversation;
}

export async function getChat(conversationID: string): Promise<Chat | null> {
    try {
        return { conversation: await getConversation(conversationID) };
    } catch (error) {
        return null;
    }
}

@Resolver((of) => Chat)
export class FieldsChatResolver {
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async shouldMarkAsReadonly(@Root() chat: Chat) {
        return await shouldMarkChatAsReadonly(chat.conversation);
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN)
    isReadonly(@Root() chat: Chat) {
        return isConversationReadOnly(chat.conversation);
    }
}
