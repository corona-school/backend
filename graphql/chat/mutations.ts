import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { getLogger } from '../../common/logger/logger';
import { prisma } from '../../common/prisma';

const logger = getLogger('MutateChatResolver');

@Resolver(() => Appointment)
export class MutateChatResolver {
    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async matchChatCreate(@Ctx() context: GraphQLContext, @Arg('matchId') matchId: number) {
        const match = await prisma.match.findUnique({ where: { id: matchId }, include: { pupil: true } });
        await hasAccess(context, 'Match', match);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async subcourseChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async participantChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.USER)
    async prospectChatCreate(@Ctx() context: GraphQLContext) {
        return true;
    }
}
