import { Authorized, Field, FieldResolver, ObjectType, Resolver, Root } from 'type-graphql';
import { isConversationReadOnly, shouldMarkChatAsReadonly } from '../../common/chat/deactivation';
import { TJConversation } from '../../common/chat/types';
import { Role } from '../roles';
import { getConversation } from '../../common/chat';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType()
export class Chat {
    @Field()
    conversationId: string;

    conversation: TJConversation;
}

export async function getChat(conversationID: string): Promise<Chat | null> {
    try {
        const conversation = await getConversation(conversationID);
        return { conversation, conversationId: conversation.id };
    } catch (error) {
        return null;
    }
}

@Resolver((of) => Chat)
export class FieldsChatResolver {
    @FieldResolver((returns) => Date)
    @Authorized(Role.ADMIN)
    createdAt(@Root() chat: Chat) {
        return chat.conversation.createdAt;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.ADMIN)
    subject(@Root() chat: Chat) {
        return chat.conversation.subject;
    }

    @FieldResolver((returns) => GraphQLJSON, { nullable: true })
    @Authorized(Role.ADMIN)
    customData(@Root() chat: Chat) {
        return chat.conversation.custom;
    }

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
