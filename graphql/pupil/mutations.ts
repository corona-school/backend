import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";

const getPupil = (pupil: GraphQLModel.Pupil) => prisma.pupil.findUnique({ where: { id: pupil.id } });

@Resolver(of => GraphQLModel.Pupil)
export class MutatePupilResolver {
    @Mutation(returns => undefined)
    async activate(@Root() _pupil: GraphQLModel.Pupil): Promise<void> {
        const pupil = await getPupil(_pupil);
        await activatePupil(pupil);
    }

    @Mutation(returns => undefined)
    async deactivate(@Root() _pupil: GraphQLModel.Pupil): Promise<void> {
        const pupil = await getPupil(_pupil);
        await deactivatePupil(pupil);
    }
}