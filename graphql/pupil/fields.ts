import { Subcourse, Pupil } from "../generated";
import { Field, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";

@Resolver(of => Pupil)
export class ExtendFieldsPupilResolver {
    @FieldResolver(type => [Subcourse])
    async subcourses(@Root() pupil: Pupil) {
        return await prisma.subcourse.findMany({
            where: {
                subcourse_participants_pupil: {
                    some: {
                        pupilId: pupil.id
                    }
                }
            }
        });
    }
}