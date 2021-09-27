import { Subcourse, Pupil, Concrete_notification, Log, Pupil_tutoring_interest_confirmation_request as TutoringInterestConfirmation } from "../generated";
import { Authorized, Field, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";
import { getUserId } from "../../common/user";
import { LimitEstimated } from "../complexity";
import { Subject } from "../types/subject";
import { parseSubjectString } from "../../common/util/subjectsutils";

@Resolver(of => Pupil)
export class ExtendFieldsPupilResolver {
    @FieldResolver(type => [Subcourse])
    @Authorized(Role.ADMIN)
    @LimitEstimated(10)
    async subcoursesJoined(@Root() pupil: Pupil) {
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

    @FieldResolver(type => [Subcourse])
    @Authorized(Role.ADMIN)
    @LimitEstimated(10)
    async subcoursesWaitingList(@Root() pupil: Pupil) {
        return await prisma.subcourse.findMany({
            where: {
                subcourse_waiting_list_pupil: {
                    some: {
                        pupilId: pupil.id
                    }
                }
            }
        });
    }

    @FieldResolver(type => [Concrete_notification])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async concreteNotifications(@Root() pupil: Required<Pupil>) {
        return await prisma.concrete_notification.findMany({ where: { userId: getUserId(pupil) }});
    }

    @FieldResolver(type => [Log])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async logs(@Root() pupil: Required<Pupil>) {
        return await prisma.log.findMany({
            where: { user: pupil.wix_id },
            orderBy: { createdAt: "asc" }
        });
    }

    @FieldResolver(type => [Subject])
    @Authorized(Role.ADMIN)
    async subjectsFormatted(@Root() pupil: Required<Pupil>) {
        return parseSubjectString(pupil.subjects);
    }

    @FieldResolver(type => TutoringInterestConfirmation)
    @Authorized(Role.ADMIN)
    async tutoringInterestConfirmation(@Root() pupil: Required<Pupil>) {
        return await prisma.pupil_tutoring_interest_confirmation_request.findFirst({
            where: { pupilId: pupil.id }
        })
    }
}