import { Student, Participation_certificate as ParticipationCertificate, Match } from "../generated";
import { Authorized, Field, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";
import { LimitEstimated } from "../complexity";
import { Subject } from "../types/subject";
import { parseSubjectString } from "../../common/util/subjectsutils";

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
    @Authorized(Role.USER)
    async subjectsFormatted(@Root() pupil: Required<Student>) {
        return parseSubjectString(pupil.subjects);
    }
}