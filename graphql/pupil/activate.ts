import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root } from "type-graphql";
import { Pupil } from "../generated/models";

@Resolver(of => Pupil)
export class ActivatePupilResolver {
    @Mutation()
    async activate(@Root() pupil: Pupil) {
        await prisma.pupil.update({
            data: { active: true },
            where: { id: pupil.id }
        });
    }
}