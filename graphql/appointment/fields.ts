import { Role } from '../authorizations';
import { Arg, Authorized, Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Lecture as Appointment } from '../generated';
import { GraphQLContext } from '../context';
import { getSessionStudent } from '../authentication';

@Resolver((of) => Appointment)
export class ExtendedFieldsLectureResolver {
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async isInstructor(@Ctx() context: GraphQLContext, @Root() appointment: Appointment, @Arg('studentId', { nullable: true }) studentId: number) {
        const student = await getSessionStudent(context, studentId);
        return appointment.instructorId === student.id;
    }
}
