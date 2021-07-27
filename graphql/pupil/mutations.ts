import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { Role } from "../authorizations";
import { getPupil, getSubcourse } from "../util";

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
        /* TODO */
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilChangeStatus(@Arg("pupilId") pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        /* TODO: choose between applied(not selectable),accepted,rejection,deregistration */
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilJoinSubcourse(@Arg("pupilId") pupilId: number, @Arg("subcourseId") subcourseId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const subcourse = await getSubcourse(subcourseId);

        /* TODO */
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async pupilUnjoinSubcourse(@Arg("pupilId") pupilId: number, @Arg("subcourseId") subcourseId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const subcourse = await getSubcourse(subcourseId);
        /*to do*/
        return true;
    }
}