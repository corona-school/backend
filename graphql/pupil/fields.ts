import { Subcourse, Pupil, Concrete_notification, Log } from "../generated";
import { Authorized, Field, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";
import { getUserId } from "../../common/user";

@Resolver(of => Pupil)
export class ExtendFieldsPupilResolver {
    @FieldResolver(type => [Subcourse])
    @Authorized(Role.ADMIN)
    async subcourses(@Root() pupil: Pupil) {

        console.log(`pupil.subcourses pupilId:`, pupil.id);

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

    @FieldResolver(type => [Concrete_notification])
    @Authorized(Role.ADMIN)
    async concreteNotifications(@Root() pupil: Required<Pupil>) {
        return await prisma.concrete_notification.findMany({ where: { userId: getUserId(pupil) }});
    }

    @FieldResolver(type => [Log])
    @Authorized(Role.ADMIN)
    async logs(@Root() pupil: Required<Pupil>) {
        return await prisma.log.findMany({
            where: { user: pupil.wix_id },
            orderBy: { createdAt: "asc" }
        });
    }
}