import {
    Student,
    Participation_certificate as ParticipationCertificate,
    Match,
    Certificate_of_conduct as CertificateOfConduct,
    Screening,
    Instructor_screening as InstructorScreening,
    Subcourse,
    Course,
} from '../generated';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { LimitEstimated } from '../complexity';
import { Subject } from '../types/subject';
import { parseSubjectString } from '../../common/util/subjectsutils';
import { Decision } from '../types/reason';
import { canStudentRequestMatch } from '../../common/match/request';
import { UserType } from '../types/user';
import { userForStudent } from '../../common/user';

@Resolver((of) => Student)
export class ExtendFieldsStudentResolver {
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
    async subcoursesInstructing(@Root() student: Student) {
        return await prisma.subcourse.findMany({ where: { subcourse_instructors_student: { some: { studentId: student.id } } } });
    }

    @FieldResolver((type) => [Course])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async coursesInstructing(@Root() student: Student) {
        return await prisma.course.findMany({ where: { course_instructors_student: { some: { studentId: student.id } } } });
    }
}
