import { Role } from '../authorizations';
import { Authorized, Field, FieldResolver, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Subcourse, Pupil, Project_match, Student } from '../generated';
import { LimitEstimated } from '../complexity';

@Resolver((of) => Project_match)
export class ExtendedFieldsProjectMatchResolver {
    @FieldResolver((returns) => Pupil)
    @Authorized(Role.ADMIN)
    @LimitEstimated(1)
    async pupil(@Root() projectMatch: Project_match) {
        return await prisma.pupil.findUnique({
            where: { id: projectMatch.pupilId },
        });
    }

    @FieldResolver((returns) => Student)
    @Authorized(Role.ADMIN)
    @LimitEstimated(1)
    async student(@Root() projectMatch: Project_match) {
        return await prisma.student.findUnique({
            where: { id: projectMatch.studentId },
        });
    }
}
