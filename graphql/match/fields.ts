import { AuthorizedDeferred, hasAccess, ImpliesRoleOnResult, Role } from '../authorizations';
import { Arg, Authorized, Ctx, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Pupil, Match, Student, Lecture as Appointment, Learning_topic as LearningTopic } from '../generated';
import { LimitEstimated } from '../complexity';
import { getStudent, getPupil } from '../util';
import { getOverlappingSubjects } from '../../common/match/util';
import { Subject } from '../types/subject';
import { GraphQLContext } from '../context';
import { Chat } from '../chat/fields';
import { getMatcheeConversation } from '../../common/chat';
import { getAppointmentsForMatch, getEdgeMatchAppointmentId } from '../../common/appointment/get';
import { parseSubjectString } from '../../common/util/subjectsutils';
import { CalendarPreferences, WeeklyAvailability } from '../types/calendarPreferences';
import { getMatchAvailabilityFromPerspective } from '../../common/util/calendarPreferences';
import { JSONResolver } from 'graphql-scalars';
import { isElevated } from '../authentication';
import { PrerequisiteError } from '../../common/util/error';
import { isMatchChatActive } from '../../common/chat/deactivation';

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
        if (match.subjectsAtMatchingTime.length) {
            return parseSubjectString(JSON.stringify(match.subjectsAtMatchingTime));
        }
        const student = await getStudent(match.studentId);
        const pupil = await getPupil(match.pupilId);
        return getOverlappingSubjects(pupil, student);
    }

    @FieldResolver((returns) => JSONResolver, { nullable: true })
    @Authorized(Role.ADMIN, Role.SCREENER, Role.OWNER)
    async matchWeeklyAvailability(
        @Root() match: Match,
        @Ctx() context: GraphQLContext,
        @Arg('fromPerspective', { nullable: true }) fromPerspective?: 'pupil' | 'student'
    ) {
        if (fromPerspective && !isElevated(context)) {
            throw new PrerequisiteError(`FromPerspective option is only available for elevated users`);
        }
        const student = await getStudent(match.studentId);
        const pupil = await getPupil(match.pupilId);

        if (!student.calendarPreferences || !pupil.calendarPreferences) {
            return null;
        }
        const studentPreferences = student.calendarPreferences as Record<string, any> as CalendarPreferences;
        const pupilPreferences = pupil.calendarPreferences as Record<string, any> as CalendarPreferences;
        if (context.user.pupilId || fromPerspective === 'pupil') {
            return getMatchAvailabilityFromPerspective(pupilPreferences.weeklyAvailability, studentPreferences.weeklyAvailability);
        } else if (context.user.studentId || fromPerspective === 'student') {
            return getMatchAvailabilityFromPerspective(studentPreferences.weeklyAvailability, pupilPreferences.weeklyAvailability);
        }
        return null;
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
    async firstAppointmentId(@Ctx() context: GraphQLContext, @Root() match: Match): Promise<number> {
        return await getEdgeMatchAppointmentId(match.id, context.user.userID, 'first');
    }

    @FieldResolver((returns) => Int, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    async lastAppointmentId(@Ctx() context: GraphQLContext, @Root() match: Match): Promise<number> {
        return await getEdgeMatchAppointmentId(match.id, context.user.userID, 'last');
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

    @FieldResolver((returns) => Boolean, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    async isChatActive(@Root() match: Required<Match>) {
        return await isMatchChatActive(match.id);
    }

    @FieldResolver((returns) => [LearningTopic])
    @Authorized(Role.ADMIN, Role.OWNER)
    @ImpliesRoleOnResult(Role.OWNER, Role.OWNER)
    async topics(@Root() match: Match) {
        return await prisma.learning_topic.findMany({
            where: {
                matchId: match.id,
            },
        });
    }
}
