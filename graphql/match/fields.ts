import { Field, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Subcourse, Pupil, Match, Student } from "../generated";

@Resolver(of => Match)
export class ExtendedFieldsMatchResolver {
    @FieldResolver(returns => Pupil)
    async pupil(@Root() match: Match) {
        return await prisma.pupil.findUnique({
            where: { id: match.pupilId }
        });
    }

    @FieldResolver(returns => Student)
    async student(@Root() match: Match) {
        return await prisma.student.findUnique({
            where: { id: match.studentId }
        });
    }
}