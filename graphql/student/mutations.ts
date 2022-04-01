import * as TypeGraphQL from "type-graphql";
import * as GraphQLModel from "../generated/models";
import {Role} from "../authorizations";
import {getStudent} from "../util";
import {deactivateStudent} from "../../common/student/activation";
import { deleteStudentMatchRequest, createStudentMatchRequest } from "../../common/match/request";
import { isElevated, getSessionStudent, getSessionScreener } from "../authentication";
import { GraphQLContext } from "../context";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { prisma } from "../../common/prisma";
import { addInstructorScreening, addTutorScreening } from "../../common/student/screening";

@TypeGraphQL.InputType("Instructor_screeningCreateInput", {
    isAbstract: true
})
export class ScreeningInput {
    @TypeGraphQL.Field(_type => Boolean, {
        nullable: false
    })
    success!: boolean;

    @TypeGraphQL.Field(_type => String, {
        nullable: true
    })
    comment?: string | undefined;

    @TypeGraphQL.Field(_type => String, {
        nullable: true
    })
    knowsCoronaSchoolFrom?: string | undefined;
}


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

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentInstructorScreeningCreate(@Ctx() context: GraphQLContext, @Arg("studentId") studentId: number, @Arg("screening") screening: ScreeningInput) {
        const student = await getStudent(studentId);
        const screener = await getSessionScreener(context);
        await addInstructorScreening(screener, student, screening);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentTutorScreeningCreate(@Ctx() context: GraphQLContext, @Arg("studentId") studentId: number, @Arg("screening") screening: ScreeningInput) {
        const student = await getStudent(studentId);
        const screener = await getSessionScreener(context);
        await addTutorScreening(screener, student, screening);
    }
}