import {Arg, Authorized, Mutation, Resolver} from "type-graphql";
import * as GraphQLModel from "../generated/models";
import {Role} from "../authorizations";
import {getStudent} from "../util";
import {deactivateStudent} from "../../common/pupil/activation";

@Resolver(of => GraphQLModel.Student)
export class MutateStudentResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async studentDeactivate(@Arg("studentId") studentId: number): Promise<boolean> {
        const student = await getStudent(studentId);
        await deactivateStudent(student);
        return true;
    }
}