import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { Arg, Authorized, Ctx, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Pupil, Match, Student, Lecture as Appointment } from '../generated';
import { LimitEstimated } from '../complexity';
import { getStudent, getPupil } from '../util';
import { getOverlappingSubjects } from '../../common/match/util';
import { Subject } from '../types/subject';
import { GraphQLContext } from '../context';
import { Chat } from '../chat/fields';
import { getMatcheeConversation } from '../../common/chat';
import { getAppointmentsForMatch, getLastMatchAppointmentId } from '../../common/appointment/get';

@Resolver((of) => Match)
export class ExtendedFieldsMatchResolver {
    @Query((returns) => Match)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async match(@Ctx() context: GraphQLContext, @Arg('matchId', (type) => Int) matchId: number) {
        const match = await prisma.match.findUniqueOrThrow({
            where: { id: matchId },
        });
        await hasAccess(context, 'Match', match);
        return match;
    }

    @FieldResolver((returns) => Pupil)
    @Authorized(Role.ADMIN, Role.SCREENER, Role.OWNER)
    @LimitEstimated(1)
    async pupil(@Root() match: Match) {
        return await prisma.pupil.findUnique({
            where: { id: match.pupilId },
        });
    }

    @FieldResolver((returns) => Student)
    @Authorized(Role.ADMIN, Role.SCREENER, Role.OWNER)
    @LimitEstimated(1)
    async student(@Root() match: Match) {
        return await prisma.student.findUnique({
            where: { id: match.studentId },
        });
    }

    @FieldResolver((returns) => [Subject])
    @Authorized(Role.ADMIN, Role.SCREENER, Role.OWNER)
    @LimitEstimated(1)
    async subjectsFormatted(@Root() match: Match) {
        const student = await getStudent(match.studentId);
        const pupil = await getPupil(match.pupilId);

        return getOverlappingSubjects(pupil, student);
    }

    @FieldResolver((returns) => [Appointment])
    @Authorized(Role.ADMIN, Role.OWNER)
    async appointments(
        @Ctx() context: GraphQLContext,
        @Root() match: Match,
        @Arg('take', { nullable: true }) take?: number,
        @Arg('skip', { nullable: true }) skip?: number,
        @Arg('cursor', { nullable: true }) cursor?: number,
        @Arg('direction', { nullable: true }) direction?: 'next' | 'last'
    ) {
        const { user } = context;
        return await getAppointmentsForMatch(match.id, user.userID, take, skip, cursor, direction);
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN, Role.OWNER)
    async appointmentsCount(@Root() match: Match) {
        return await prisma.lecture.count({
            where: {
                matchId: match.id,
                isCanceled: false,
            },
        });
    }

    @FieldResolver((returns) => Int, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    async lastAppointmentId(@Ctx() context: GraphQLContext, @Root() match: Match): Promise<number> {
        return await getLastMatchAppointmentId(match.id, context.user.userID);
    }

    @FieldResolver((returns) => Chat, { nullable: true })
    @Authorized(Role.ADMIN)
    async chat(@Root() match: Required<Match>) {
        try {
            const { conversation } = await getMatcheeConversation(match);
            return { conversation, conversationId: conversation.id } as Chat;
        } catch (error) {
            return null;
        }
    }
}
