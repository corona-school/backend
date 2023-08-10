import {
    Subcourse,
    Pupil,
    Concrete_notification,
    Log,
    Pupil_tutoring_interest_confirmation_request as TutoringInterestConfirmation,
    Participation_certificate as ParticipationCertificate,
    Match,
    Pupil_screening as PupilScreening,
} from '../generated';
import { Arg, Authorized, Field, FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { ImpliesRoleOnResult, Role } from '../authorizations';
import { userForPupil } from '../../common/user';
import { LimitEstimated } from '../complexity';
import { Subject } from '../types/subject';
import { parseSubjectString } from '../../common/util/subjectsutils';
import { gradeAsInt } from '../../common/util/gradestrings';
import { Decision } from '../types/reason';
import { canPupilRequestMatch } from '../../common/match/request';
import { canJoinSubcourses } from '../../common/courses/participants';
import { UserType } from '../types/user';
import { Prisma } from '@prisma/client';
import { joinedBy, excludePastSubcourses, onlyPastSubcourses } from '../../common/courses/filters';

@Resolver((of) => Pupil)
export class ExtendFieldsPupilResolver {
    @FieldResolver((type) => UserType)
    @Authorized(Role.ADMIN, Role.OWNER)
    user(@Root() pupil: Required<Pupil>) {
        return userForPupil(pupil);
    }

    @FieldResolver((type) => [Subcourse])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    @ImpliesRoleOnResult(Role.SUBCOURSE_PARTICIPANT, /* if we are */ Role.OWNER)
    async subcoursesJoined(
        @Root() pupil: Required<Pupil>,
        @Arg('excludePast', { nullable: true }) excludePast?: boolean,
        @Arg('onlyPast', { nullable: true }) onlyPast?: boolean
    ) {
        const filters: Prisma.subcourseWhereInput[] = [joinedBy(pupil)];

        if (excludePast) {
            filters.push(excludePastSubcourses());
        }

        if (onlyPast) {
            filters.push(onlyPastSubcourses());
        }

        return await prisma.subcourse.findMany({
            where: { AND: filters },
        });
    }

    @FieldResolver((type) => [Subcourse])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async subcoursesWaitingList(@Root() pupil: Pupil) {
        return await prisma.subcourse.findMany({
            where: {
                AND: [
                    {
                        waiting_list_enrollment: {
                            some: {
                                pupilId: pupil.id,
                            },
                        },
                    },
                    excludePastSubcourses(),
                ],
            },
        });
    }

    @FieldResolver((type) => [Concrete_notification])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async concreteNotifications(@Root() pupil: Required<Pupil>) {
        return await prisma.concrete_notification.findMany({ where: { userId: userForPupil(pupil).userID } });
    }

    @FieldResolver((type) => [Log])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async logs(@Root() pupil: Required<Pupil>) {
        return await prisma.log.findMany({
            where: { user: pupil.wix_id },
            orderBy: { createdAt: 'asc' },
        });
    }

    @FieldResolver((type) => [Subject])
    @Authorized(Role.USER, Role.ADMIN)
    async subjectsFormatted(@Root() pupil: Required<Pupil>) {
        return parseSubjectString(pupil.subjects);
    }

    @FieldResolver((type) => TutoringInterestConfirmation, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(1)
    async tutoringInterestConfirmation(@Root() pupil: Required<Pupil>) {
        return await prisma.pupil_tutoring_interest_confirmation_request.findFirst({
            where: { pupilId: pupil.id, invalidated: false },
        });
    }

    @FieldResolver((type) => [ParticipationCertificate])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async participationCertificatesToSign(@Root() pupil: Required<Pupil>) {
        return await prisma.participation_certificate.findMany({
            where: { pupilId: pupil.id },
        });
    }

    @FieldResolver((type) => [Match])
    @Authorized(Role.ADMIN, Role.OWNER, Role.SCREENER)
    @LimitEstimated(10)
    @ImpliesRoleOnResult(Role.OWNER, /* if we are */ Role.OWNER)
    async matches(@Root() pupil: Required<Pupil>) {
        return await prisma.match.findMany({
            where: { pupilId: pupil.id },
        });
    }

    @FieldResolver((type) => Int)
    @Authorized(Role.ADMIN, Role.OWNER)
    gradeAsInt(@Root() pupil: Required<Pupil>) {
        return gradeAsInt(pupil.grade);
    }

    @FieldResolver((type) => Decision)
    @Authorized(Role.ADMIN, Role.OWNER)
    async canRequestMatch(@Root() pupil: Required<Pupil>) {
        return await canPupilRequestMatch(pupil);
    }

    @FieldResolver((type) => Decision)
    @Authorized(Role.ADMIN, Role.OWNER)
    async canJoinSubcourses(@Root() pupil: Required<Pupil>) {
        return canJoinSubcourses(pupil);
    }

    @FieldResolver((type) => [PupilScreening])
    @Authorized(Role.ADMIN, Role.OWNER)
    async screenings(@Root() pupil: Required<Pupil>) {
        return await prisma.pupil_screening.findMany({
            where: { pupilId: pupil.id },
        });
    }
}
