import { Role } from "../authorizations";
import { Authorized, Field, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Subcourse, Pupil, Match, Student } from "../generated";

@Resolver(of => Match)
export class ExtendedFieldsMatchResolver {
    @FieldResolver(returns => Pupil)
    @Authorized(Role.ADMIN)
    async pupil(@Root() match: Match) {
        return await prisma.pupil.findUnique({
            where: { id: match.pupilId }
        });
    }

    @FieldResolver(returns => Student)
    @Authorized(Role.ADMIN)
    async student(@Root() match: Match) {
        return await prisma.student.findUnique({
            where: { id: match.studentId }
        });
    }
}