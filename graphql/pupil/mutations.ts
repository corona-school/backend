import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { Role } from "../authorizations";
import { getPupil, getSubcourse } from "../util";
import { joinSubcourse, leaveSubcourse } from "../../common/courses/participants";

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
        /* TODO: Implement using new notification system
           Notificarion.actionTaken("user-resend-verification", { authToken: ... }); */
        throw new Error("Not implemented");

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilChangeStatus(@Arg("pupilId") pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        /* TODO: choose between applied(not selectable),accepted,rejection,deregistration
           Needed? */
        throw new Error("Not implemented");
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
    async pupilLeaveSubcourse(@Arg("pupilId") pupilId: number, @Arg("subcourseId") subcourseId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const subcourse = await getSubcourse(subcourseId);

        await leaveSubcourse(subcourse, pupil);

        return true;
    }
}