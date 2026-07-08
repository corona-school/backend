import {
    Subcourse,
    Pupil,
    Concrete_notification,
    Log,
    Pupil_tutoring_interest_confirmation_request as TutoringInterestConfirmation,
    Participation_certificate as ParticipationCertificate,
    Match,
    Pupil_screening as PupilScreening,
    School,
} from '../generated';
import { Arg, Authorized, Ctx, Field, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { ImpliesRoleOnResult, Role } from '../authorizations';
import { userForPupil } from '../../common/user';
import { LimitEstimated } from '../complexity';
import { Subject, SubjectStatsForPupils } from '../types/subject';
import { parseSubjectString } from '../../common/util/subjectsutils';
import { gradeAsInt } from '../../common/util/gradestrings';
import { Decision } from '../types/reason';
import { canPupilRequestMatch } from '../../common/match/request';
import { canJoinSubcourses } from '../../common/courses/participants';
import { UserType } from '../types/user';
import { Prisma } from '@prisma/client';
import { joinedBy, excludePastSubcourses, onlyPastSubcourses } from '../../common/courses/filters';
import { GraphQLBoolean } from 'graphql';
import { subcourseSearch } from '../../common/courses/search';
import moment from 'moment';
import { GraphQLContext } from '../context';
import { normalizeLastName } from '../../common/pupil';

@Resolver((of) => Pupil)
export class ExtendFieldsPupilResolver {
    @FieldResolver((type) => UserType)
    @Authorized(Role.ADMIN, Role.OWNER, Role.PUPIL_SCREENER)
    user(@Root() pupil: Required<Pupil>) {
        return userForPupil(pupil);
    }

    @FieldResolver((type) => String)
    @Authorized(Role.ADMIN, Role.OWNER, Role.SCREENER, Role.TUTOR, Role.INSTRUCTOR)
    lastname(@Root() pupil: Required<Pupil>, @Ctx() context: GraphQLContext) {
        return normalizeLastName(pupil, context);
    }

    @FieldResolver((type) => [Subcourse])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    @ImpliesRoleOnResult(Role.SUBCOURSE_PARTICIPANT, /* if we are */ Role.OWNER)
    async subcoursesJoined(
        @Root() pupil: Required<Pupil>,
        @Arg('excludePast', { nullable: true }) excludePast?: boolean,
        @Arg('onlyPast', { nullable: true }) onlyPast?: boolean,
        @Arg('search', { nullable: true }) search?: string
    ) {
        const filters: Prisma.subcourseWhereInput[] = [joinedBy(pupil)];

        if (excludePast) {
            filters.push(excludePastSubcourses());
        }

        if (onlyPast) {
            filters.push(onlyPastSubcourses());
        }

        if (search) {
            filters.push(await subcourseSearch(search));
        }

        return await prisma.subcourse.findMany({
            where: { AND: filters },
        });
    }

    @FieldResolver((type) => Int)
    @Authorized(Role.ADMIN, Role.OWNER)
    async totalSubcoursesJoined(@Root() pupil: Required<Pupil>) {
        const filters: Prisma.subcourseWhereInput[] = [joinedBy(pupil)];
        return await prisma.subcourse.count({ where: { AND: filters } });
    }

    @FieldResolver((type) => [Subcourse])
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitEstimated(10)
    async subcoursesWaitingList(@Root() pupil: Pupil, @Arg('search', { nullable: true }) search?: string) {
        const filters: Prisma.subcourseWhereInput[] = [
            {
                waiting_list_enrollment: {
                    some: {
                        pupilId: pupil.id,
                    },
                },
            },
            excludePastSubcourses(),
        ];

        if (search) {
            filters.push(await subcourseSearch(search));
        }

        return await prisma.subcourse.findMany({
            where: {
                AND: filters,
            },
        });
    }

    @FieldResolver((type) => [Concrete_notification])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async concreteNotifications(@Root() pupil: Required<Pupil>) {
        return await prisma.concrete_notification.findMany({ where: { userId: userForPupil(pupil).userID } });
    }

    @FieldResolver((type) => [Subject])
    @Authorized(Role.USER, Role.SCREENER, Role.ADMIN)
    subjectsFormatted(@Root() pupil: Required<Pupil>) {
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

    @FieldResolver((type) => Int, { nullable: true })
    @Authorized(Role.ADMIN, Role.SCREENER, Role.OWNER, Role.TUTOR, Role.INSTRUCTOR)
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
    canJoinSubcourses(@Root() pupil: Required<Pupil>) {
        return canJoinSubcourses(pupil);
    }

    @FieldResolver((type) => [PupilScreening])
    @Authorized(Role.ADMIN, Role.SCREENER, Role.OWNER)
    async screenings(@Root() pupil: Required<Pupil>) {
        return await prisma.pupil_screening.findMany({
            where: { pupilId: pupil.id },
        });
    }

    @Query((returns) => [Pupil])
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER)
    async pupilsToBeScreened(@Arg('onlyDisputed', () => GraphQLBoolean, { nullable: true }) onlyDisputed = false) {
        return await prisma.pupil.findMany({
            where: {
                active: true,
                pupil_screening: { some: { invalidated: false, status: { in: onlyDisputed ? ['dispute'] : ['dispute', 'pending'] } } },
            },
        });
    }

    @FieldResolver((returns) => School, { nullable: true })
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER, Role.OWNER)
    async school(@Root() pupil: Required<Pupil>) {
        if (!pupil.schoolId) {
            return;
        }
        return await prisma.school.findFirst({
            where: { id: pupil.schoolId },
        });
    }

    @FieldResolver((returns) => Boolean, { nullable: true })
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER, Role.OWNER)
    async needScreening(@Root() pupil: Required<Pupil>) {
        const hasActiveMatch = (await prisma.match.count({ where: { pupilId: pupil.id, dissolved: false } })) > 0;
        const screeningInTheLastFourMonths = await prisma.pupil_screening.findFirst({
            where: {
                pupilId: pupil.id,
                status: 'success',
                invalidated: false,
                createdAt: {
                    gte: moment().subtract(4, 'months').toDate(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return !screeningInTheLastFourMonths || hasActiveMatch;
    }

    @Query(() => [SubjectStatsForPupils])
    @Authorized(Role.ADMIN, Role.TUTEE, Role.PUPIL_SCREENER)
    async subjectsForPupils() {
        const result = (await prisma.$queryRaw`
            WITH match_subjects AS (
                SELECT
                    m.id,
                    m."pupilId",
                    s->>'name' AS subject,
                    ROUND(
                        EXTRACT(EPOCH FROM (m."createdAt" - m."pupilFirstMatchRequest")) / 86400
                    ) AS days_to_match
                FROM match m
                CROSS JOIN LATERAL unnest(m."subjectsAtMatchingTime") AS s
                WHERE m."createdAt" >= DATE '2025-06-01'
                AND (s->>'mandatory')::BOOLEAN = TRUE
            )
            SELECT
                subject,
                COUNT(*) AS match_count,
                ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_to_match)) AS median_days,
                ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY days_to_match)) AS p90_days
            FROM match_subjects
            GROUP BY subject
            ORDER BY match_count DESC;
        `) as { subject: string; match_count: number; median_days: number; p90_days: number }[];
        return result.map((s) => ({
            subject: s.subject,
            waitingDaysRange: s.match_count > 5 ? { from: s.median_days, to: s.p90_days } : { from: 0, to: 0 },
        }));
    }
}
