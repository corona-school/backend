import { Course, Subcourse, Course_tag as CourseTag, Course_category as CourseCategory } from '../generated';
import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { accessURLForKey } from '../../common/file-bucket/s3';
import { GraphQLContext } from '../context';
import { getSessionStudent } from '../authentication';

@Resolver((of) => Course)
export class ExtendedFieldsCourseResolver {
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
        if (!course.imageKey) {
            return null;
        }

        return accessURLForKey(course.imageKey);
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
            where: { category }
        });
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async isInstructor(@Ctx() context: GraphQLContext, @Root() course: Course, @Arg('studentId', { nullable: true }) studentId: number) {
        const student = await getSessionStudent(context, studentId);
        return (await prisma.course_instructors_student.count({ where: { courseId: course.id, studentId: student.id } })) > 0;
    }
}
