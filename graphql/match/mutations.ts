import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { AuthorizedDeferred, hasAccess, Role } from "../authorizations";
import { getMatch, getPupil, getStudent } from "../util";
import { dissolveMatch } from "../../common/match/dissolve";
import { createMatch } from "../../common/match/create";
import { GraphQLContext } from "../context";
import { isSessionPupil, getSessionPupil, getSessionStudent } from "../authentication";
import { createPupilMatchRequest, createStudentMatchRequest } from "../../common/match/request";

@Resolver(of => GraphQLModel.Match)
export class MutateMatchResolver {

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async matchAdd(@Arg("pupilId") pupilId: number, @Arg("studentId") studentId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const student = await getStudent(studentId);

        await createMatch(pupil, student);

        return true;
    }

    @Mutation(returns => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async matchDissolve(@Ctx() context: GraphQLContext, @Arg("matchId") matchId: number, @Arg("dissolveReason") dissolveReason: number): Promise<boolean> {
        const match = await getMatch(matchId);
        await hasAccess(context, "Match", match);

        await dissolveMatch(match, dissolveReason, /* dissolver:*/ null);

        return true;
    }
}