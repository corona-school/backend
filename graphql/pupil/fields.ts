import { Subcourse, Pupil, Concrete_notification, Log, Pupil_tutoring_interest_confirmation_request as TutoringInterestConfirmation, Participation_certificate as ParticipationCertificate, Match } from "../generated";
import { Authorized, Field, FieldResolver, Int, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";
import { getUserIdTypeORM, userForPupil } from "../../common/user";
import { LimitEstimated } from "../complexity";
import { Subject } from "../types/subject";
import { parseSubjectString } from "../../common/util/subjectsutils";
import { gradeAsInt } from "../../common/util/gradestrings";
import { Decision } from "../types/reason";
import { canPupilRequestMatch } from "../../common/match/request";
import { canJoinSubcourses } from "../../common/courses/participants";
import { UserType } from "../user/fields";

@Resolver(of => Pupil)
export class ExtendFieldsPupilResolver {
    @FieldResolver(type => UserType)
    @Authorized(Role.ADMIN, Role.OWNER)
    user(@Root() pupil: Required<Pupil>) {
        return userForPupil(pupil);
    }

    @FieldResolver(type => [Subcourse])
    @Authorized(Role.ADMIN, Role.OWNER)
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
        return await prisma.concrete_notification.findMany({ where: { userId: getUserIdTypeORM(pupil) } });
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
    @Authorized(Role.USER, Role.ADMIN)
    async subjectsFormatted(@Root() pupil: Required<Pupil>) {
        return parseSubjectString(pupil.subjects);
    }

    @FieldResolver(type => TutoringInterestConfirmation, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(1)
    async tutoringInterestConfirmation(@Root() pupil: Required<Pupil>) {
        return await prisma.pupil_tutoring_interest_confirmation_request.findFirst({
            where: { pupilId: pupil.id }
        });
    }

    @FieldResolver(type => [ParticipationCertificate])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async participationCertificatesToSign(@Root() pupil: Required<Pupil>) {
        return await prisma.participation_certificate.findMany({
            where: { pupilId: pupil.id }
        });
    }

    @FieldResolver(type => [Match])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async matches(@Root() pupil: Required<Pupil>) {
        return await prisma.match.findMany({
            where: { pupilId: pupil.id }
        });
    }

    @FieldResolver(type => Int)
    @Authorized(Role.ADMIN, Role.OWNER)
    gradeAsInt(@Root() pupil: Required<Pupil>) {
        return gradeAsInt(pupil.grade);
    }

    @FieldResolver(type => Decision)
    @Authorized(Role.ADMIN, Role.OWNER)
    async canRequestMatch(@Root() pupil: Required<Pupil>) {
        return await canPupilRequestMatch(pupil);
    }

    @FieldResolver(type => Decision)
    @Authorized(Role.ADMIN, Role.OWNER)
    async canJoinSubcourses(@Root() pupil: Required<Pupil>) {
        return canJoinSubcourses(pupil);
    }
}