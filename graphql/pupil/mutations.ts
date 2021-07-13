import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root } from "type-graphql";
import { Pupil } from "../generated/models";
import { activatePupil, deactivatePupil } from "../../common/pupil/activation";

@Resolver(of => Pupil)
export class ActivatePupilResolver {
    @Mutation()
    async activate(@Root() pupil: Pupil) {
        await activatePupil(pupil);
    }

    @Mutation()
    async deactivate(@Root() pupil: Pupil) {
        await deactivatePupil(pupil);
    }
}