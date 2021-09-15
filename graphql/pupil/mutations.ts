import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { Role } from "../authorizations";
import { getPupil, getSubcourse } from "../util";
import { joinSubcourse, joinSubcourseWaitinglist, leaveSubcourse, leaveSubcourseWaitinglist } from "../../common/courses/participants";
import * as Notification from "../../common/notification";
import { refreshToken } from "../../common/pupil/token";

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
    @Authorized(Role.ADMIN)
    async pupilJoinSubcourse(@Arg("pupilId") pupilId: number, @Arg("subcourseId") subcourseId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const subcourse = await getSubcourse(subcourseId);

        await joinSubcourse(subcourse, pupil);

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilJoinSubcourseWaitinglist(@Arg("pupilId") pupilId: number, @Arg("subcourseId") subcourseId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const subcourse = await getSubcourse(subcourseId);

        await joinSubcourseWaitinglist(subcourse, pupil);

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilLeaveSubcourseWaitinglist(@Arg("pupilId") pupilId: number, @Arg("subcourseId") subcourseId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const subcourse = await getSubcourse(subcourseId);

        await leaveSubcourseWaitinglist(subcourse, pupil, /* force */ true);

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
}