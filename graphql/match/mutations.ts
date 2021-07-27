import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";
import { getMatch, getPupil, getStudent } from "../util";

@Resolver(of => GraphQLModel.Match)
export class MutateMatchResolver {

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async matchAdd(@Arg("pupilId") pupilId: number, @Arg("studentId") studentId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const student = await getStudent(studentId);
        /* TODO */
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async matchDissolve(@Arg("matchId") matchId: number): Promise<boolean> {
        const match = await getMatch(matchId);
        /* TODO */
        return true;
    }
}