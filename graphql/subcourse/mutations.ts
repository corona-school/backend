import { createBBBMeeting, createOrUpdateCourseAttendanceLog, getMeetingUrl, isBBBMeetingRunning, startBBBMeeting } from '../../common/util/bbb';
import { getLogger } from 'log4js';
import * as TypeGraphQL from 'type-graphql';
import { Arg, Authorized, Ctx, InputType, Mutation, Resolver } from 'type-graphql';
import { fillSubcourse, joinSubcourse, joinSubcourseWaitinglist, leaveSubcourse, leaveSubcourseWaitinglist } from '../../common/courses/participants';
import { sendSubcourseCancelNotifications } from '../../common/mails/courses';
import { prisma } from '../../common/prisma';
import { getSessionPupil, getSessionStudent, isSessionPupil, isSessionStudent } from '../authentication';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { GraphQLContext } from '../context';
import { ForbiddenError, UserInputError } from '../error';
import * as GraphQLModel from '../generated/models';
import { getCourse, getLecture, getSubcourse } from '../util';
import { canPublish } from '../../common/courses/states';
import { getUserTypeORM } from '../../common/user';
import { PrerequisiteError } from '../../common/util/error';
import { Pupil as TypeORMPupil } from '../../common/entity/Pupil';

const logger = getLogger('MutateCourseResolver');

@InputType()
class PublicSubcourseCreateInput {
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int)
    minGrade!: number;
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int)
    maxGrade!: number;
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int)
    maxParticipants!: number;
    @TypeGraphQL.Field((_type) => Boolean)
    joinAfterStart!: boolean;
    @TypeGraphQL.Field((_type) => [PublicLectureInput], { nullable: true })
    lectures?: PublicLectureInput[];
}

@InputType()
class PublicSubcourseEditInput {
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int)
    minGrade!: number;
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int)
    maxGrade!: number;
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int)
    maxParticipants!: number;
    @TypeGraphQL.Field((_type) => Boolean)
    joinAfterStart!: boolean;
}

@InputType()
class PublicLectureInput {
    @TypeGraphQL.Field((_type) => Date)
    start!: Date;
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int)
    duration!: number;
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int, { nullable: true })
    instructorId?: number | null;
}

@Resolver((of) => GraphQLModel.Subcourse)
export class MutateSubcourseResolver {
    @Mutation((returns) => GraphQLModel.Subcourse)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseCreate(
        @Ctx() context: GraphQLContext,
        @Arg('courseId') courseId: number,
        @Arg('subcourse') subcourse: PublicSubcourseCreateInput,
        @Arg('studentId', { nullable: true }) studentId?: number
    ): Promise<GraphQLModel.Subcourse> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);

        const { joinAfterStart, minGrade, maxGrade, maxParticipants, lectures } = subcourse;
        const result = await prisma.subcourse.create({
            data: { courseId, published: false, joinAfterStart, minGrade, maxGrade, maxParticipants, lecture: { createMany: { data: lectures } } },
        });

        const student = await getSessionStudent(context, studentId);
        await prisma.subcourse_instructors_student.create({ data: { subcourseId: result.id, studentId: student.id } });

        logger.info(`Subcourse(${result.id}) was created for Course(${courseId}) and Student(${student.id})`);
        return result;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcoursePublish(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        const can = await canPublish(subcourse);
        if (!can.allowed) {
            throw new Error(`Cannot Publish Subcourse(${subcourseId}), reason: ${can.reason}`);
        }

        await prisma.subcourse.update({ data: { published: true }, where: { id: subcourseId } });
        logger.info(`Subcourse (${subcourseId}) was published`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseFill(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        await fillSubcourse(subcourse);
        return true;
    }

    @Mutation((returns) => GraphQLModel.Subcourse)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseEdit(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('subcourse') data: PublicSubcourseEditInput
    ): Promise<GraphQLModel.Subcourse> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);
        const participantCount = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });
        if (data.maxParticipants < participantCount) {
            throw new ForbiddenError(`Decreasing the number of max participants below the current number of participants is not allowed`);
        }
        const result = await prisma.subcourse.update({ data: { ...data }, where: { id: subcourseId } });
        await fillSubcourse(result);
        return result;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseCancel(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);
        await prisma.subcourse.update({ data: { cancelled: true }, where: { id: subcourse.id } });
        const course = await getCourse(subcourse.courseId);
        sendSubcourseCancelNotifications(course, subcourse);
        logger.info(`Subcourse (${subcourse.id}) was cancelled`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseSetMeetingURL(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number, @Arg('meetingURL') meetingURL: string) {
        const url = new URL(meetingURL);
        if (url.protocol !== 'https:') {
            throw new Error(`Meetings must be done via HTTPS not ${url.protocol}`);
        }

        const subcourse = await getSubcourse(subcourseId);
        const course = await getCourse(subcourse.courseId);

        await hasAccess(context, 'Subcourse', subcourse);

        const existingMeeting = await prisma.bbb_meeting.findFirst({
            where: { meetingID: '' + subcourse.id },
        });

        if (existingMeeting) {
            await prisma.bbb_meeting.update({
                data: { alternativeUrl: meetingURL },
                where: { id: existingMeeting.id },
            });
            logger.info(`User(${context.user?.userID}) updated alternative url for Subcourse(${subcourse.id}): '${meetingURL}'`);
            return true;
        }

        await prisma.bbb_meeting.create({
            data: {
                meetingID: '' + subcourse.id,
                meetingName: course.name,
                alternativeUrl: meetingURL,
            },
        });

        logger.info(`User(${context.user?.userID}) added alternative url for Subcourse(${subcourse.id}): '${meetingURL}'`);
        return true;
    }

    @Mutation((returns) => String)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.SUBCOURSE_PARTICIPANT)
    async subcourseJoinMeeting(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await getSubcourse(subcourseId);
        const course = await getCourse(subcourse.courseId);

        await hasAccess(context, 'Subcourse', subcourse);

        let meeting = await prisma.bbb_meeting.findFirst({ where: { meetingID: '' + subcourse.id } });
        if (!meeting) {
            meeting = await createBBBMeeting(course.name, '' + subcourse.id, await getUserTypeORM(context.user!.userID));
        }

        if (meeting.alternativeUrl) {
            logger.info(`User(${context.user?.userID}) joins meeting of Subcourse(${subcourse.id}) with alternative url '${meeting.alternativeUrl}'`);
            return meeting.alternativeUrl;
        }

        // Start Meeting if needed
        const isRunning = await isBBBMeetingRunning(meeting.meetingID);
        if (!isRunning) {
            if (!isSessionStudent(context)) {
                throw new PrerequisiteError(`Meeting not yet started. Only the Instructor can start the meeting`);
            }

            await startBBBMeeting(meeting);
        }

        // Log Course attendance for pupils
        if (isSessionPupil(context)) {
            await createOrUpdateCourseAttendanceLog((await getUserTypeORM(context.user!.userID)) as TypeORMPupil, context.ip, '' + subcourseId);
        }

        const url = getMeetingUrl('' + subcourse.id, `${context.user!.firstname} ${context.user!.lastname}`, meeting.moderatorPW);
        logger.info(`User(${context.user?.userID}) joins meeting of Subcourse(${subcourse.id}) with url '${url}'`);
        return url;
    }

    @Mutation((returns) => GraphQLModel.Lecture)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async lectureCreate(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('lecture') lecture: PublicLectureInput
    ): Promise<GraphQLModel.Lecture> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        let currentDate = new Date();
        if (+lecture.start < +currentDate) {
            throw new UserInputError(`Lecture of subcourse (${subcourseId}) must happen in the future.`);
        }

        const result = await prisma.lecture.create({ data: { ...lecture, subcourseId } });
        logger.info(`Lecture (${result.id}) was created on subcourse (${subcourse.id})`);
        return result;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async lectureDelete(@Ctx() context: GraphQLContext, @Arg('lectureId') lectureId: number): Promise<Boolean> {
        const lecture = await getLecture(lectureId);
        const subcourse = await getSubcourse(lecture.subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);
        let currentDate = new Date();
        if (+lecture.start < +currentDate) {
            throw new ForbiddenError(`Past lecture (${lecture.id}) of subcourse (${subcourse.id}) can't be deleted.`);
        } else if (subcourse.published) {
            throw new ForbiddenError(`Lecture (${lecture.id}) of a published subcourse (${subcourse.id}) can't be deleted`);
        }
        await prisma.lecture.delete({ where: { id: lecture.id } });
        logger.info(`Lecture (${lecture.id}) was deleted`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL)
    async subcourseJoin(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('pupilId', { nullable: true }) pupilId?: number
    ): Promise<boolean> {
        const pupil = await getSessionPupil(context, pupilId);
        const subcourse = await getSubcourse(subcourseId);
        await joinSubcourse(subcourse, pupil);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.SUBCOURSE_PARTICIPANT)
    async subcourseLeave(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('pupilId', { nullable: true }) pupilId?: number
    ): Promise<boolean> {
        const pupil = await getSessionPupil(context, pupilId);
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        await leaveSubcourse(subcourse, pupil);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL)
    async subcourseJoinWaitinglist(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('pupilId', { nullable: true }) pupilId?: number
    ): Promise<boolean> {
        const pupil = await getSessionPupil(context, pupilId);
        const subcourse = await getSubcourse(subcourseId);
        await joinSubcourseWaitinglist(subcourse, pupil);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL)
    async subcourseLeaveWaitinglist(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('pupilId', { nullable: true }) pupilId?: number
    ): Promise<boolean> {
        const pupil = await getSessionPupil(context, pupilId);
        const subcourse = await getSubcourse(subcourseId);
        await leaveSubcourseWaitinglist(subcourse, pupil, /* force */ true);
        return true;
    }
}
