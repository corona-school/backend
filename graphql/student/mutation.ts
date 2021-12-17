import { createStudentMatchRequest, deleteStudentMatchRequest } from "../../common/match/request";
import { getSessionStudent, isElevated } from "../authentication";
import { Role } from "../authorizations";
import { GraphQLContext } from "../context";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from "type-graphql";
import * as GraphQLModel from "../generated/models";

@Resolver(of => GraphQLModel.Student)
export class MutateStudentResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL)
    async studentCreateMatchRequest(@Ctx() context: GraphQLContext, @Arg("studentId", { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, /* elevated override */ studentId);

        await createStudentMatchRequest(student, isElevated(context));

        return true;
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async studentDeleteMatchRequest(@Ctx() context: GraphQLContext, @Arg("studentId", { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, /* elevated override */ studentId);
        await deleteStudentMatchRequest(student);

        return true;
    }
}