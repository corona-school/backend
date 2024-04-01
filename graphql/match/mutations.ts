import * as TypeGraphQL from 'type-graphql';
import { Arg, Authorized, Ctx, InputType, Int, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import * as Notification from '../../common/notification';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { getMatch, getPupil, getStudent } from '../util';
import { dissolveMatch, reactivateMatch } from '../../common/match/dissolve';
import { createMatch } from '../../common/match/create';
import { GraphQLContext } from '../context';
import { ConcreteMatchPool, pools } from '../../common/match/pool';
import { getMatcheeConversation, markConversationAsWriteable } from '../../common/chat';
import { JSONResolver } from 'graphql-scalars';
import { createAdHocMeeting } from '../../common/appointment/create';
import { AuthenticationError } from '../error';
import { dissolved_by_enum } from '@prisma/client';
import { dissolve_reason } from '../generated';
import { prisma } from '../../common/prisma';
import { getFullName, getUserTypeAndIdForUserId } from '../../common/user';
import { DEFAULTSENDERS, sendMail } from '../../common/notification/channels/mailjet';
import { isDev } from '../../common/util/environment';

@InputType()
class MatchDissolveInput {
    @TypeGraphQL.Field((_type) => Int)
    matchId!: number;
    @TypeGraphQL.Field((_type) => [dissolve_reason])
    dissolveReasons!: dissolve_reason[];
}

@InputType()
class MatchReportInput {
    @TypeGraphQL.Field((_type) => Int)
    matchId!: number;
    @TypeGraphQL.Field((_type) => String)
    description!: string;
}

@Resolver((of) => GraphQLModel.Match)
export class MutateMatchResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async matchAdd(@Arg('pupilId') pupilId: number, @Arg('studentId') studentId: number, @Arg('poolName') poolName: string): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const student = await getStudent(studentId);
        const pool = pools.find((it) => it.name === poolName);
        if (!pool) {
            throw new Error(`Unknown MatchPool(${poolName})`);
        }

        await createMatch(pupil, student, pool as ConcreteMatchPool);

        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async matchDissolve(@Ctx() context: GraphQLContext, @Arg('info') info: MatchDissolveInput): Promise<boolean> {
        const match = await getMatch(info.matchId);
        await hasAccess(context, 'Match', match);

        let dissolvedBy: dissolved_by_enum;
        let dissolver = null;
        if (context.user.pupilId != null) {
            dissolvedBy = dissolved_by_enum.pupil;
            dissolver = await prisma.pupil.findUnique({ where: { id: context.user.pupilId } });
        } else if (context.user.studentId != null) {
            dissolvedBy = dissolved_by_enum.student;
            dissolver = await prisma.student.findUnique({ where: { id: context.user.studentId } });
        } else {
            dissolvedBy = dissolved_by_enum.admin;
        }

        await dissolveMatch(match, info.dissolveReasons, dissolver, dissolvedBy);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async matchReport(@Ctx() context: GraphQLContext, @Arg('report') report: MatchReportInput): Promise<boolean> {
        const match = await getMatch(report.matchId);
        await hasAccess(context, 'Match', match);

        const reporter = context.user;
        const [reporterType] = getUserTypeAndIdForUserId(reporter.userID);

        let reported = null;
        const reportedType = reporterType === 'student' ? 'pupil' : 'student';
        reported = null;
        if (reportedType === 'student') {
            reported = await prisma.student.findUnique({ where: { id: match.studentId } });
        } else {
            reported = await prisma.pupil.findUnique({ where: { id: match.pupilId } });
        }

        const userTypeLabel = {
            student: 'Helfer:in',
            pupil: 'Schüler:in',
        };

        let body =
            `Meldende Person: ${reporter.email} (${userTypeLabel[reporterType]})\n` + `Gemeldete Person: ${reported.email} (${userTypeLabel[reportedType]})\n`;
        if (report.description) {
            body += `-----------------------------------------------------\n\n` + `Nachricht von ${reporter.firstname}: ${report.description}`;
        }

        await sendMail(
            `User-App - ${getFullName(reporter)} hat ein Problem mit ${getFullName(reported)} gemeldet`,
            body,
            /* from */ DEFAULTSENDERS.noreply,
            /* to */ isDev ? 'backend@lern-fair.de' : 'support@lern-fair.de',
            /* from name */ 'User-App Problemmeldung Formular',
            /* to name */ `Das beste Supportteam der Welt`,
            /* reply to */ context.user.email,
            /* reply to name */ getFullName(context.user)
        );
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async matchReactivate(@Arg('matchId', (type) => Int) matchId: number): Promise<boolean> {
        const match = await getMatch(matchId);
        await reactivateMatch(match);
        const { conversation, conversationId } = await getMatcheeConversation({
            studentId: match.studentId,
            pupilId: match.pupilId,
        });

        if (conversation) {
            await markConversationAsWriteable(conversationId);
        }
        return true;
    }

    @Mutation((returns) => JSONResolver, { nullable: true })
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async matchCreateAdHocMeeting(@Ctx() context: GraphQLContext, @Arg('matchId', (type) => Int) matchId: number) {
        const { user } = context;
        const match = await getMatch(matchId);
        await hasAccess(context, 'Match', match);

        if (user.studentId) {
            const { id, appointmentType } = await createAdHocMeeting(matchId, user);
            return { id, appointmentType };
        }
        throw new AuthenticationError(`User is not allowed to create ad-hoc meeting for match ${matchId}`);
    }
}
