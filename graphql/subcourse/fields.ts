import { Course, Lecture, Subcourse } from "../generated";
import { Authorized, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";

@Resolver(of => Subcourse)
export class ExtendedFieldsSubcourseResolver {
    @FieldResolver(returns => Course)
    @Authorized(Role.ADMIN)
    async course(@Root() subcourse: Subcourse) {
        return await prisma.course.findUnique({
            where: { id: subcourse.courseId }
        });
    }

    @FieldResolver(returns => [Lecture])
    @Authorized(Role.ADMIN)
    async lectures(@Root() subcourse: Subcourse) {
        return await prisma.lecture.findMany({
            where: {
                subcourseId: subcourse.id
            }
        });
    }
}

