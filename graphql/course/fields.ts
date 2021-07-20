import { Course, Subcourse } from "../generated";
import { FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";

@Resolver(of => Course)
export class ExtendedFieldsCourseResolver {
    @FieldResolver(returns => [Subcourse])
    async subcourses(@Root() course: Course) {
        return await prisma.subcourse.findMany({
            where: {
                courseId: course.id
            }
        });
    }
}