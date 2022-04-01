import {Arg, Authorized, Ctx, Mutation, Resolver} from "type-graphql";
import * as GraphQLModel from "../generated/models";
import {Role} from "../authorizations";
import {getStudent} from "../util";
import {deactivateStudent} from "../../common/student/activation";
import { deleteStudentMatchRequest, createStudentMatchRequest } from "../../common/match/request";
import { isElevated, getSessionStudent } from "../authentication";
import { GraphQLContext } from "../context";

@Resolver(of => GraphQLModel.Student)
export class MutateStudentResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async studentDeactivate(@Arg("studentId") studentId: number): Promise<boolean> {
        const student = await getStudent(studentId);
        await deactivateStudent(student);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN, Role.TUTOR)
    async studentCreateMatchRequest(@Ctx() context: GraphQLContext, @Arg("studentId", { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, /* elevated override */ studentId);

        await createStudentMatchRequest(student, isElevated(context));

        return true;
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN, Role.TUTOR)
    async studentDeleteMatchRequest(@Ctx() context: GraphQLContext, @Arg("studentId", { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, /* elevated override */ studentId);
        await deleteStudentMatchRequest(student);

        return true;
    }
}