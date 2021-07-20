import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";

const getPupil = (pupilId: number) => prisma.pupil.findUnique({ where: { id: pupilId } });

@Resolver(of => GraphQLModel.Pupil)
export class MutatePupilResolver {
    @Mutation(returns => Boolean)
    async pupilActivate(@Arg("pupilId") pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await activatePupil(pupil);
        return true;
    }

    @Mutation(returns => Boolean)
    async pupilDeactivate(@Arg("pupilId") pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await deactivatePupil(pupil);
        return true;
    }
}