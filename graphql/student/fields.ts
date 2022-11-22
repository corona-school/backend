import {
    Student,
    Participation_certificate as ParticipationCertificate,
    Match,
    Certificate_of_conduct as CertificateOfConduct,
    Screening,
    Instructor_screening as InstructorScreening,
    Subcourse,
    Course,
    StudentWhereInput,
    SubcourseWhereInput,
} from '../generated';
import { Arg, Authorized, Ctx, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { LimitedQuery, LimitEstimated } from '../complexity';
import { Subject } from '../types/subject';
import { parseSubjectString } from '../../common/util/subjectsutils';
import { Decision } from '../types/reason';
import { canStudentRequestMatch } from '../../common/match/request';
import { UserType } from '../types/user';
import { userForStudent, userSearch } from '../../common/user';
import { Instructor } from '../types/instructor';
import { GraphQLContext } from '../context';
import { predictedHookActionDate } from '../../common/notification';
import { excludePastSubcourses, instructedBy } from '../../common/courses/filters';
import { Prisma } from '@prisma/client';

@Resolver((of) => Student)
export class ExtendFieldsStudentResolver {
    @Query((returns) => [Instructor])
    @Authorized(Role.INSTRUCTOR)
    @LimitedQuery()
    async otherInstructors(
        @Ctx() context: GraphQLContext,
        @Arg('search') search: string,
        @Arg('take', (type) => Int) take: number,
        @Arg('skip', (type) => Int) skip: number
    ): Promise<Instructor[]> {
        const query: StudentWhereInput = {
            isInstructor: { equals: true },
            active: { equals: true },
            verification: null,
            instructor_screening: { is: { success: { equals: true } } },
            id: { not: { equals: context.user.studentId! } },
        };

        return await prisma.student.findMany({
            where: { AND: [query, userSearch(search)] },
            take,
            skip,
            select: { firstname: true, lastname: true, aboutMe: true, id: true },
        });
    }

    @FieldResolver((type) => UserType)
    @Authorized(Role.ADMIN, Role.OWNER)
    user(@Root() student: Required<Student>) {
        return userForStudent(student);
    }

    @FieldResolver((type) => [ParticipationCertificate])
    @Authorized(Role.ADMIN, Role.OWNER)
    async participationCertificates(@Root() student: Required<Student>) {
        return await prisma.participation_certificate.findMany({
            where: { studentId: student.id },
        });
    }

    @FieldResolver((type) => [Match])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async matches(@Root() student: Required<Student>) {
        return await prisma.match.findMany({
            where: { studentId: student.id },
        });
    }

    @FieldResolver((type) => [Subject])
    @Authorized(Role.ADMIN, Role.OWNER)
    async subjectsFormatted(@Root() student: Required<Student>) {
        return parseSubjectString(student.subjects);
    }

    @FieldResolver((type) => Decision)
    @Authorized(Role.ADMIN, Role.OWNER)
    async canRequestMatch(@Root() student: Required<Student>) {
        return await canStudentRequestMatch(student);
    }

    @FieldResolver((type) => Decision)
    @Authorized(Role.ADMIN, Role.OWNER)
    async canCreateCourse(@Root() student: Required<Student>): Promise<Decision> {
        if (!student.isInstructor) {
            return { allowed: false, reason: 'not-instructor' };
        }

        const wasInstructorScreened = (await prisma.instructor_screening.count({ where: { studentId: student.id, success: true } })) > 0;
        if (!wasInstructorScreened) {
            return { allowed: false, reason: 'not-screened' };
        }

        return { allowed: true };
    }

    // eslint-disable-next-line camelcase
    @FieldResolver((type) => CertificateOfConduct, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(1)
    async certificateOfConduct(@Root() student: Student) {
        return await prisma.certificate_of_conduct.findUnique({
            where: {
                studentId: student.id,
            },
        });
    }

    // Date when a student will be deactivated as they have not handed in a valid certificate of conduct
    @FieldResolver((type) => Date, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    async certificateOfConductDeactivationDate(@Root() student: Required<Student>) {
        return await predictedHookActionDate('coc_reminder', 'deactivate-student', userForStudent(student));
    }

    @FieldResolver((type) => [Screening])
    @Authorized(Role.ADMIN, Role.OWNER)
    async tutorScreenings(@Root() student: Student) {
        return await prisma.screening.findMany({
            where: { studentId: student.id },
        });
    }

    @FieldResolver((type) => [InstructorScreening])
    @Authorized(Role.ADMIN, Role.OWNER)
    async instructorScreenings(@Root() student: Student) {
        return await prisma.instructor_screening.findMany({
            where: { studentId: student.id },
        });
    }

    @FieldResolver((type) => [Subcourse])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async subcoursesInstructing(@Root() student: Required<Student>, @Arg('excludePast', { nullable: true }) excludePast?: boolean) {
        const filters: Prisma.subcourseWhereInput[] = [instructedBy(student)];

        if (excludePast) {
            filters.push(excludePastSubcourses());
        }

        return await prisma.subcourse.findMany({ where: { AND: filters } });
    }

    @FieldResolver((type) => [Course])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async coursesInstructing(@Root() student: Student) {
        return await prisma.course.findMany({ where: { course_instructors_student: { some: { studentId: student.id } } } });
    }
}
