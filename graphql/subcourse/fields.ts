import { Course, Lecture, Subcourse } from "../generated";
import { FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";

@Resolver(of => Subcourse)
export class ExtendedFieldsSubcourseResolver {
    @FieldResolver(returns => Course)
    async course(@Root() subcourse: Subcourse) {
        return await prisma.course.findUnique({
            where: { id: subcourse.courseId }
        });
    }

    @FieldResolver(returns => [Lecture])
    async lectures(@Root() subcourse: Subcourse) {
        return await prisma.lecture.findMany({
            where: {
                subcourseId: subcourse.id
            }
        });
    }
}

