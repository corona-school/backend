import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { Role } from "../authorizations";

const getPupil = (pupilId: number) => prisma.pupil.findUnique({ where: { id: pupilId }, rejectOnNotFound: true });

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
    async resendVerificationMail(@Arg("pupilId") pupilId: number/*to do*/): Promise<boolean> {
        /*to do*/
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async addTutoringRequest(@Arg("pupilId") pupilId: number/*to do*/ ): Promise<boolean>{
        /*to do*/
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async editTutoringRequest(@Arg("pupilId") pupilId: number/*to do*/ ): Promise<boolean>{
        /*to do*/
        /*Edit subjects,status and priority*/
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async takeBackTutoringRequest(@Arg("pupilId") pupilId: number/*to do*/ ): Promise<boolean>{
        /*to do*/
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async changePupilStatus(@Arg("pupilId") pupilId: number/*to do*/ ): Promise<boolean>{
        /*to do*/
        /*choose between applied(not selectable),accepted,rejection,deregistration*/
        return true
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async addCourse(@Arg("pupilId") pupilId: number/*to do*/ ): Promise<boolean>{
        /*to do*/
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async deregisterPupil(@Arg("pupilId") pupilId: number/*to do*/ ): Promise<boolean>{
        /*to do*/
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async seePupilActions(@Arg("pupilId") pupilId: number/*to do*/ ): Promise<boolean>{
        /*to do*/
        return true;
    }
}