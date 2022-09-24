import { Course, Subcourse, Course_tag as CourseTag } from '../generated';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { accessURLForKey } from '../../common/file-bucket/s3';

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
                        courseId: course.id
                    }
                }
            }
        });
    }

}
