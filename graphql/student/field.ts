import { Authorized, FieldResolver, Resolver, Root } from "type-graphql";
import { Certificate_of_conduct, Student } from "../generated";
import { Role } from "../authorizations";
import { LimitEstimated } from "../complexity";
import { prisma } from "../../common/prisma";

@Resolver(of => Student)
export class ExtendedFieldsStudentResolver {
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