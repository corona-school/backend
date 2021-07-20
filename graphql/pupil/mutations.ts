import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";
import { Role } from "../authorizations";

const getPupil = (pupilId: number) => prisma.pupil.findUnique({ where: { id: pupilId } });

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
}