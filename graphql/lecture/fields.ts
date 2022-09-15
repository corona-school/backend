import { Role } from '../authorizations';
import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Course, Lecture, Subcourse, Pupil, Bbb_meeting as BBBMeeting } from '../generated';
import { GraphQLContext } from '../context';
import { getSessionStudent } from '../authentication';
import { prisma } from '../../common/prisma';

@Resolver((of) => Lecture)
export class ExtendedFieldsLectureResolver {
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async isInstructor(@Ctx() context: GraphQLContext, @Root() subcourse: Subcourse, @Arg('studentId', { nullable: true }) studentId: number) {
        const student = await getSessionStudent(context, studentId);
        return (await prisma.lecture.count({ where: { instructorId: student.id } })) > 0;
    }
}
