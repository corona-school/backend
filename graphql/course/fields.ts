import { Course, Subcourse, Course_tag as CourseTag, course_category_enum as CourseCategory } from '../generated';
import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { accessURLForKey } from '../../common/file-bucket/s3';
import { GraphQLContext } from '../context';
import { getSessionStudent } from '../authentication';
import { getCourseImageURL } from '../../common/courses/util';
import { courseSearch } from '../../common/courses/search';
import { LimitedQuery } from '../complexity';
import { GraphQLInt } from 'graphql';

@Resolver((of) => Course)
export class ExtendedFieldsCourseResolver {
    @Query((returns) => [Course])
    @Authorized(Role.ADMIN, Role.SCREENER)
    @LimitedQuery()
    async courseSearch(
        @Arg('search') search: string,
        @Arg('take', () => GraphQLInt) take,
        @Arg('skip', () => GraphQLInt, { nullable: true }) skip: number = 0
    ) {
        return await prisma.course.findMany({
            where: await courseSearch(search),
            take,
            skip,
        });
    }

    @FieldResolver((returns) => [Subcourse])
    @Authorized(Role.ADMIN, Role.OWNER)
    async subcourses(@Root() course: Course) {
        return await prisma.subcourse.findMany({
            where: {
                courseId: course.id,
            },
        });
    }

    @FieldResolver((returns) => String, { nullable: true })
    @Authorized(Role.UNAUTHENTICATED)
    image(@Root() course: Course) {
        return getCourseImageURL(course);
    }

    @FieldResolver((returns) => [CourseTag])
    @Authorized(Role.UNAUTHENTICATED)
    async tags(@Root() course: Course) {
        return await prisma.course_tag.findMany({
            where: {
                course_tags_course_tag: {
                    some: {
                        courseId: course.id,
                    },
                },
            },
        });
    }

    @Query((returns) => [CourseTag])
    @Authorized(Role.UNAUTHENTICATED)
    async courseTags(@Arg('category') category: CourseCategory) {
        return await prisma.course_tag.findMany({
            where: { category },
        });
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async isInstructor(@Ctx() context: GraphQLContext, @Root() course: Course, @Arg('studentId', { nullable: true }) studentId: number) {
        const student = await getSessionStudent(context, studentId);
        return (await prisma.course_instructors_student.count({ where: { courseId: course.id, studentId: student.id } })) > 0;
    }

    @FieldResolver((returns) => [Course])
    @Authorized(Role.ADMIN, Role.OWNER, Role.INSTRUCTOR)
    async templateCourses(
        @Arg('studentId', { nullable: true }) studentId: number,
        @Arg('search') search: string,
        @Arg('take', () => GraphQLInt) take,
        @Arg('skip', () => GraphQLInt, { nullable: true }) skip: number = 0
    ) {
        const courseSearchFilters = await courseSearch(search);
        const courses = await prisma.course.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                course_instructors_student: {
                                    some: {
                                        studentId: studentId,
                                    },
                                },
                            },
                            courseSearchFilters,
                        ],
                    },
                    {
                        shared: true,
                    },
                ],
            },
            take,
            skip,
        });

        return courses;
    }
}
