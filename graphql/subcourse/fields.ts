import { Course, Lecture, Subcourse, Pupil, SubcourseWhereInput, SubcourseOrderByInput } from "../generated";
import { Arg, Authorized, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";
import { LimitedQuery, LimitEstimated } from "../complexity";
import { CourseState } from "../../common/entity/Course";

@Resolver(of => Subcourse)
export class ExtendedFieldsSubcourseResolver {

    @Query(returns => [Subcourse])
    @Authorized(Role.UNAUTHENTICATED)
    @LimitedQuery()
    async subcoursesPublic(
        @Arg("take") take?: number,
        @Arg("skip") skip?: number,
        @Arg("search") search?: string,
        @Arg("onlyJoinable") onlyJoinable?: boolean
    ) {

        const filters: SubcourseWhereInput[] = [{
            published: { equals: true },
            cancelled: { equals: false },
            course: {
                is: {
                    courseState: { equals: CourseState.ALLOWED }
                }
            }
        }];

        if (search) {
            filters.push({
                course: { is: { OR: [
                    { outline: { contains: search, mode: "insensitive" }},
                    { name: { contains: search, mode: "insensitive" }}
                ] }}
            });
        }

        if (onlyJoinable) {
            filters.push({ OR: [
                { joinAfterStart: { equals: false }, lecture: { every: { start: { gt: new Date() }}} },
                { joinAfterStart: { equals: true }, lecture: { some: { start: { gt: new Date() }}} }
            ] });
        }

        return await prisma.subcourse.findMany({
            where: { AND: filters },
            take,
            skip,
            orderBy: { updatedAt: "desc" }
        });
    }

    @FieldResolver(returns => Course)
    @Authorized(Role.UNAUTHENTICATED)
    @LimitEstimated(1)
    async course(@Root() subcourse: Subcourse) {
        return await prisma.course.findUnique({
            where: { id: subcourse.courseId }
        });
    }

    @FieldResolver(returns => [Lecture])
    @Authorized(Role.ADMIN)
    @LimitEstimated(10)
    async lectures(@Root() subcourse: Subcourse) {
        return await prisma.lecture.findMany({
            where: {
                subcourseId: subcourse.id
            }
        });
    }

    @FieldResolver(returns => [Pupil])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async participants(@Root() subcourse: Subcourse) {
        return await prisma.pupil.findMany({
            where: {
                subcourse_participants_pupil: {
                    some: {
                        subcourseId: subcourse.id
                    }
                }
            }
        });
    }

    @FieldResolver(returns => Number)
    @Authorized(Role.ADMIN)
    async participantsCount(@Root() subcourse: Subcourse) {
        return await prisma.subcourse_participants_pupil.count({
            where: { subcourseId: subcourse.id }
        });
    }
}

