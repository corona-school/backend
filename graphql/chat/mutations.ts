import { Ctx, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { getLogger } from '../../common/logger/logger';

const logger = getLogger('MutateChatResolver');

@Resolver(() => Appointment)
export class MutateChatResolver {
    @Mutation(() => Boolean)
    async matchChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }

    @Mutation(() => Boolean)
    subcourseChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }

    @Mutation(() => Boolean)
    async participantChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }

    @Mutation(() => Boolean)
    async prospectChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }
}
