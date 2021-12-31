import { Course, Lecture, Subcourse, Pupil, SubcourseWhereInput} from "../generated";
import { Arg, Authorized, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";
import { LimitedQuery, LimitEstimated } from "../complexity";
import { CourseState } from "../../common/entity/Course";
import { PublicCache } from "../cache";

@Resolver(of => Subcourse)
export class ExtendedFieldsSubcourseResolver {

    @Query(returns => [Subcourse])
    @Authorized(Role.UNAUTHENTICATED)
    @LimitedQuery()
    @PublicCache()
    async subcoursesPublic(
        @Arg("take", { nullable: true }) take?: number,
        @Arg("skip", { nullable: true }) skip?: number,
        @Arg("search", { nullable: true }) search?: string,
        @Arg("onlyJoinable", { nullable: true }) onlyJoinable?: boolean
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
    @PublicCache()
    async course(@Root() subcourse: Subcourse) {
        return await prisma.course.findUnique({
            where: { id: subcourse.courseId }
        });
    }

    @FieldResolver(returns => [Lecture])
    @Authorized(Role.UNAUTHENTICATED)
    @LimitEstimated(10)
    @PublicCache()
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
    @Authorized(Role.UNAUTHENTICATED)
    @PublicCache()
    async participantsCount(@Root() subcourse: Subcourse) {
        return await prisma.subcourse_participants_pupil.count({
            where: { subcourseId: subcourse.id }
        });
    }
}

