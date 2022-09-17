import { Course, Lecture, Subcourse, Pupil, Bbb_meeting as BBBMeeting } from '../generated';
import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Prisma } from '@prisma/client';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { LimitedQuery, LimitEstimated } from '../complexity';
import { CourseState } from '../../common/entity/Course';
import { PublicCache } from '../cache';
import { getSessionPupil, getSessionStudent, isElevated } from '../authentication';
import { GraphQLContext } from '../context';

@Resolver((of) => Subcourse)
export class ExtendedFieldsSubcourseResolver {
    @Query((returns) => [Subcourse])
    @Authorized(Role.UNAUTHENTICATED)
    @LimitedQuery()
    @PublicCache()
    async subcoursesPublic(
        @Arg('take', { nullable: true }) take?: number,
        @Arg('skip', { nullable: true }) skip?: number,
        @Arg('search', { nullable: true }) search?: string,
        @Arg('onlyJoinable', { nullable: true }) onlyJoinable?: boolean
    ) {
        const filters: Prisma.subcourseWhereInput[] = [
            {
                published: { equals: true },
                cancelled: { equals: false },
                course: {
                    is: {
                        courseState: { equals: CourseState.ALLOWED },
                    },
                },
            },
        ];

        if (search) {
            filters.push({
                course: { is: { OR: [{ outline: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }] } },
            });
        }

        if (onlyJoinable) {
            filters.push({
                OR: [
                    { joinAfterStart: { equals: false }, lecture: { every: { start: { gt: new Date() } } } },
                    { joinAfterStart: { equals: true }, lecture: { some: { start: { gt: new Date() } } } },
                ],
            });
        }

        return await prisma.subcourse.findMany({
            where: { AND: filters },
            take,
            skip,
            orderBy: { updatedAt: 'desc' },
        });
    }

    @FieldResolver((returns) => Course)
    @Authorized(Role.UNAUTHENTICATED)
    @LimitEstimated(1)
    @PublicCache()
    async course(@Root() subcourse: Subcourse) {
        return await prisma.course.findUnique({
            where: { id: subcourse.courseId },
        });
    }

    @FieldResolver((returns) => [Lecture])
    @Authorized(Role.UNAUTHENTICATED)
    @LimitEstimated(10)
    @PublicCache()
    async lectures(@Root() subcourse: Subcourse) {
        return await prisma.lecture.findMany({
            where: {
                subcourseId: subcourse.id,
            },
        });
    }

    @FieldResolver((returns) => [Pupil])
    @Authorized(Role.ADMIN, Role.INSTRUCTOR)
    @LimitEstimated(100)
    async participants(@Ctx() context: GraphQLContext, @Root() subcourse: Subcourse) {
        if (!isElevated(context)) {
            return await prisma.pupil.findMany({
                select: { firstname: true, lastname: true, grade: true },
                where: {
                    subcourse_participants_pupil: {
                        some: {
                            subcourseId: subcourse.id,
                        },
                    },
                },
            });
        }
        return await prisma.pupil.findMany({
            where: {
                subcourse_participants_pupil: {
                    some: {
                        subcourseId: subcourse.id,
                    },
                },
            },
        });
    }

    @FieldResolver((returns) => Number)
    @Authorized(Role.UNAUTHENTICATED)
    @PublicCache()
    async participantsCount(@Root() subcourse: Subcourse) {
        return await prisma.subcourse_participants_pupil.count({
            where: { subcourseId: subcourse.id },
        });
    }

    @FieldResolver((returns) => [Pupil])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async pupilsWaiting(@Root() subcourse: Subcourse) {
        return await prisma.pupil.findMany({
            where: {
                subcourse_waiting_list_pupil: {
                    some: {
                        subcourseId: subcourse.id,
                    },
                },
            },
        });
    }

    @FieldResolver((returns) => Number)
    @Authorized(Role.UNAUTHENTICATED)
    @PublicCache()
    async pupilsWaitingCount(@Root() subcourse: Subcourse) {
        return await prisma.subcourse_waiting_list_pupil.count({
            where: { subcourseId: subcourse.id },
        });
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL)
    async isParticipant(@Ctx() context: GraphQLContext, @Root() subcourse: Subcourse, @Arg('pupilId', { nullable: true }) pupilId: number) {
        const pupil = await getSessionPupil(context, pupilId);
        return (await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id, pupilId: pupil.id } })) > 0;
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async isInstructor(@Ctx() context: GraphQLContext, @Root() subcourse: Subcourse, @Arg('studentId', { nullable: true }) studentId: number) {
        const student = await getSessionStudent(context, studentId);
        return (await prisma.subcourse_instructors_student.count({ where: { subcourseId: subcourse.id, studentId: student.id } })) > 0;
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL)
    async isOnWaitingList(@Ctx() context: GraphQLContext, @Root() subcourse: Subcourse, @Arg('pupilId', { nullable: true }) pupilId: number) {
        const pupil = await getSessionPupil(context, pupilId);
        return (await prisma.subcourse_waiting_list_pupil.count({ where: { subcourseId: subcourse.id, pupilId: pupil.id } })) > 0;
    }

    @FieldResolver((returns) => BBBMeeting, { nullable: true })
    @Authorized(Role.OWNER, Role.ADMIN)
    async meeting(@Root() subcourse: Subcourse) {
        return await prisma.bbb_meeting.findFirst({
            where: { meetingID: '' + subcourse.id },
        });
    }
}
