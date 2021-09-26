import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { AuthorizedDeferred, hasAccess, Role } from "../authorizations";
import { getPupil, getSubcourse } from "../util";
import { joinSubcourse, leaveSubcourse } from "../../common/courses/participants";
import * as Notification from "../../common/notification";
import { refreshToken } from "../../common/pupil/token";
import { createMatchRequest, deleteMatchRequest } from "../../common/match/request";
import { GraphQLContext } from "../context";

@Resolver(of => GraphQLModel.Pupil)
export class MutatePupilResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilActivate(@Arg("pupilId") pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await activatePupil(pupil);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilDeactivate(@Arg("pupilId") pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await deactivatePupil(pupil);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilResendVerificationMail(@Arg("pupilId") pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);

        const secretToken = await refreshToken(pupil);
        await Notification.actionTaken(pupil, "user_authenticate", {
            secretToken
        });
        return true;
    }

    @Mutation(returns => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async pupilJoinSubcourse(@Ctx() context: GraphQLContext, @Arg("pupilId") pupilId: number, @Arg("subcourseId") subcourseId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await hasAccess(context, "Pupil", pupil);

        const subcourse = await getSubcourse(subcourseId);

        await joinSubcourse(subcourse, pupil);

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilLeaveSubcourse(@Arg("pupilId") pupilId: number, @Arg("subcourseId") subcourseId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const subcourse = await getSubcourse(subcourseId);

        await leaveSubcourse(subcourse, pupil);

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilCreateMatchRequest(@Arg("pupilId") pupilId: number, @Ctx() context: GraphQLContext): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const isAdmin = context.user.roles.includes(Role.ADMIN);

        await createMatchRequest(pupil, isAdmin);

        return true;
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilDeleteMatchRequest(@Arg("pupilId") pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await deleteMatchRequest(pupil);

        return true;
    }
}