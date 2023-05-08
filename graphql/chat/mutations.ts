import { Ctx, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred } from '../authorizations';
import { getLogger } from '../../common/logger/logger';

const logger = getLogger('MutateChatResolver');

@Resolver(() => Appointment)
export class MutateChatResolver {
    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async matchChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async subcourseChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async participantChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async prospectChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }
}
