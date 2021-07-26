import { Course, Subcourse } from "../generated";
import { Authorized, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";

@Resolver(of => Course)
export class ExtendedFieldsCourseResolver {
    @FieldResolver(returns => [Subcourse])
    @Authorized(Role.ADMIN)
    async subcourses(@Root() course: Course) {
        return await prisma.subcourse.findMany({
            where: {
                courseId: course.id
            }
        });
    }
}