import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { AuthorizedDeferred, hasAccess, Role } from "../authorizations";
import { getPupil, getStudent } from "../util";
import { GraphQLContext } from "../context";
import { isSessionPupil, getSessionPupil, getSessionStudent } from "../authentication";
import { CourseCreateInput } from "../generated";

@Resolver((of) => GraphQLModel.Course)
export class MutateCourseResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async courseCreate(@Arg("course") course: CourseCreateInput): Promise<boolean> {
        await prisma.course.create({ data: course as any });
        return true;
    }
}
