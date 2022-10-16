import { Prisma } from '@prisma/client';
import { Arg, Authorized, Ctx, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { canJoinSubcourse, isParticipant } from '../../common/courses/participants';
import { CourseState } from '../../common/entity/Course';
import { prisma } from '../../common/prisma';
import { getSessionPupil, getSessionStudent, isElevated, isSessionPupil, isSessionStudent } from '../authentication';
import { Role } from '../authorizations';
import { PublicCache } from '../cache';
import { LimitedQuery, LimitEstimated } from '../complexity';
import { GraphQLContext } from '../context';
import { Bbb_meeting as BBBMeeting, Course, Lecture, Pupil, pupil_schooltype_enum, Subcourse } from '../generated';
import { Decision } from '../types/reason';

@ObjectType()
class Participant {
    @Field((_type) => Int)
    id: number;
    @Field((_type) => String)
    firstname: string;
    @Field((_type) => String)
    lastname: string;
    @Field((_type) => String)
    grade: string;
    @Field((_type) => pupil_schooltype_enum)
    schooltype: 'grundschule' | 'gesamtschule' | 'hauptschule' | 'realschule' | 'gymnasium' | 'f_rderschule' | 'berufsschule' | 'other';
}

const IS_PUBLIC_SUBCOURSE: Prisma.subcourseWhereInput = {
    published: { equals: true },
    cancelled: { equals: false },
    course: {
        is: {
            courseState: { equals: CourseState.ALLOWED },
        },
    },
};

@ObjectType()
class OtherParticipant {
    @Field((_type) => Int)
    id: number;
    @Field((_type) => String)
    firstname: string;
    @Field((_type) => String)
    grade: string;
}

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
        // All filters need to match
        const filters = [IS_PUBLIC_SUBCOURSE];

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

    @Query((returns) => Subcourse, { nullable: true })
    @Authorized(Role.UNAUTHENTICATED)
    async subcourse(@Ctx() context: GraphQLContext, @Arg('subcourseId', (type) => Int) subcourseId: number) {
        if (isElevated(context)) {
            // Admins and Screeners can see every subcourse:
            return await prisma.subcourse.findFirst({ where: { id: subcourseId } });
        }

        // Only one of the filters needs to match to grant the user access:
        const accessGrantFilters = [IS_PUBLIC_SUBCOURSE];

        if (isSessionPupil(context)) {
            // A pupil has access to unpublished subcourses if they are a participant ...
            accessGrantFilters.push({
                subcourse_participants_pupil: {
                    some: { pupilId: context.user!.pupilId! },
                },
            });

            // ... or on the waiting list
            accessGrantFilters.push({
                subcourse_participants_pupil: {
                    some: { pupilId: context.user!.pupilId! },
                },
            });
        }

        if (isSessionStudent(context)) {
            // Students have access to all subcourses they own
            accessGrantFilters.push({
                subcourse_instructors_student: {
                    some: { studentId: context.user!.studentId },
                },
            });
        }

        // Returns null if the subcourse does not exist,
        //  or if the user does not have access
        return await prisma.subcourse.findFirst({
            where: {
                id: subcourseId,
                OR: accessGrantFilters,
            },
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

    @FieldResolver((returns) => [Participant])
    @Authorized(Role.OWNER)
    @LimitEstimated(100)
    async participants(@Root() subcourse: Subcourse) {
        return await prisma.pupil.findMany({
            where: {
                subcourse_participants_pupil: {
                    some: {
                        subcourseId: subcourse.id,
                    },
                },
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                grade: true,
                schooltype: true,
            },
        });
    }

    @FieldResolver((returns) => [OtherParticipant])
    @Authorized(Role.SUBCOURSE_PARTICIPANT)
    @LimitEstimated(100)
    async otherParticipants(@Ctx() context: GraphQLContext, @Root() subcourse: Subcourse) {
        return await prisma.pupil.findMany({
            where: {
                subcourse_participants_pupil: {
                    some: {
                        subcourseId: subcourse.id,
                        pupilId: { not: context.user.pupilId },
                    },
                },
            },
            select: {
                id: true,
                firstname: true,
                grade: true,
            },
        });
    }

    @FieldResolver((returns) => [Pupil])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async participantsAsPupil(@Root() subcourse: Subcourse) {
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
    async isParticipant(@Ctx() context: GraphQLContext, @Root() subcourse: Required<Subcourse>, @Arg('pupilId', { nullable: true }) pupilId: number) {
        const pupil = await getSessionPupil(context, pupilId);
        return isParticipant(subcourse, pupil);
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

    @FieldResolver((returns) => Decision)
    @Authorized(Role.ADMIN, Role.PUPIL)
    async canJoin(@Ctx() context: GraphQLContext, @Root() subcourse: Required<Subcourse>, @Arg('pupilId', { nullable: true }) pupilId: number) {
        const pupil = await getSessionPupil(context, pupilId);
        return await canJoinSubcourse(subcourse, pupil);
    }
}
