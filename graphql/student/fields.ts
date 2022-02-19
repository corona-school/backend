import {
    Student,
    Participation_certificate as ParticipationCertificate,
    Match,
    Certificate_of_conduct
} from "../generated";
import { Authorized, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";
import { LimitEstimated } from "../complexity";
import { Subject } from "../types/subject";
import { parseSubjectString } from "../../common/util/subjectsutils";
import { Decision } from "../types/reason";
import { canStudentRequestMatch } from "../../common/match/request";

@Resolver(of => Student)
export class ExtendFieldsStudentResolver {

    @FieldResolver(type => [ParticipationCertificate])
    @Authorized(Role.ADMIN, Role.OWNER)
    async participationCertificates(@Root() student: Required<Student>) {
        return await prisma.participation_certificate.findMany({
            where: { studentId: student.id }
        });
    }

    @FieldResolver(type => [Match])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async matches(@Root() student: Required<Student>) {
        return await prisma.match.findMany({
            where: { studentId: student.id }
        });
    }

    @FieldResolver(type => [Subject])
    @Authorized(Role.ADMIN, Role.USER)
    async subjectsFormatted(@Root() pupil: Required<Student>) {
        return parseSubjectString(pupil.subjects);
    }

    @FieldResolver(type => Decision)
    @Authorized(Role.ADMIN, Role.OWNER)
    async canRequestMatch(@Root() student: Required<Student>) {
        return await canStudentRequestMatch(student);
    }

    // eslint-disable-next-line camelcase
    @FieldResolver(type => Certificate_of_conduct, {nullable: true})
    @Authorized(Role.ADMIN)
    @LimitEstimated(1)
    async certificateOfConduct(@Root() student: Student) {
        return await prisma.certificate_of_conduct.findUnique({
            where: {
                studentId: student.id
            }
        });
    }
}