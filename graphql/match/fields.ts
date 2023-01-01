import { Role } from '../authorizations';
import { Authorized, Ctx, Field, FieldResolver, Int, ObjectType, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Subcourse, Pupil, Match, Student } from '../generated';
import { LimitEstimated } from '../complexity';
import { getStudent, getPupil } from '../util';
import { getOverlappingSubjects } from '../../common/match/util';
import { Subject } from '../types/subject';

@Resolver((of) => Match)
export class ExtendedFieldsMatchResolver {
    @FieldResolver((returns) => Pupil)
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(1)
    async pupil(@Root() match: Match) {
        return await prisma.pupil.findUnique({
            where: { id: match.pupilId },
        });
    }

    @FieldResolver((returns) => Student)
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(1)
    async student(@Root() match: Match) {
        return await prisma.student.findUnique({
            where: { id: match.studentId },
        });
    }

    @FieldResolver((returns) => [Subject])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(1)
    async subjectsFormatted(@Root() match: Match) {
        const student = await getStudent(match.studentId);
        const pupil = await getPupil(match.pupilId);

        return getOverlappingSubjects(pupil, student);
    }

    // Unfortunately it is difficult to define conditional access on a user's email without raising field level access restrictions,
    //  which we don't really want as the email is very sensitive data.
    // Thus in hope that a proper Chat will soon replace email communication, manually release the fields through this indirection:
    @FieldResolver((returns) => String)
    @Authorized(Role.OWNER)
    async pupilEmail(@Root() match: Match) {
        return await (
            await prisma.pupil.findUniqueOrThrow({ where: { id: match.pupilId }, select: { email: true } })
        ).email;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.OWNER)
    async studentEmail(@Root() match: Match) {
        return await (
            await prisma.student.findUniqueOrThrow({ where: { id: match.studentId }, select: { email: true } })
        ).email;
    }
}
