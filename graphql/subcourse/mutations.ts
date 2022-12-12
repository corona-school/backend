import { createBBBMeeting, createOrUpdateCourseAttendanceLog, getMeetingUrl, isBBBMeetingRunning, startBBBMeeting } from '../../common/util/bbb';
import { getLogger } from 'log4js';
import * as TypeGraphQL from 'type-graphql';
import { Arg, Authorized, Ctx, InputType, Int, Mutation, Resolver, UnauthorizedError } from 'type-graphql';
import { fillSubcourse, joinSubcourse, joinSubcourseWaitinglist, leaveSubcourse, leaveSubcourseWaitinglist } from '../../common/courses/participants';
import { sendGuestInvitationMail, sendSubcourseCancelNotifications } from '../../common/mails/courses';
import { prisma } from '../../common/prisma';
import { getSessionPupil, getSessionStudent, isElevated, isSessionPupil, isSessionStudent } from '../authentication';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { GraphQLContext } from '../context';
import { AuthenticationError, ForbiddenError, UserInputError } from '../error';
import * as GraphQLModel from '../generated/models';
import { getCourse, getLecture, getStudent, getSubcourse } from '../util';
import { canPublish } from '../../common/courses/states';
import { getUserTypeORM } from '../../common/user';
import { PrerequisiteError } from '../../common/util/error';
import { Pupil, Pupil as TypeORMPupil } from '../../common/entity/Pupil';
import { randomBytes } from 'crypto';
import { getManager } from 'typeorm';
import { CourseGuest as TypeORMCourseGuest } from '../../common/entity/CourseGuest';
import { getFile } from '../files';
import { contactInstructors, contactParticipants } from '../../common/courses/contact';
import { Student } from '../../common/entity/Student';
import { validateEmail } from '../validators';

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
    async subcourseAddInstructor(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('studentId') studentId: number
    ): Promise<boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);
        await getStudent(studentId);
        await prisma.subcourse_instructors_student.create({ data: { subcourseId, studentId } });
        logger.info(`Student (${studentId}) was added as an instructor to Subcourse(${subcourseId}) by User(${context.user!.userID})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseDeleteInstructor(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('studentId') studentId: number
    ): Promise<boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);
        await getStudent(studentId);
        await prisma.subcourse_instructors_student.delete({ where: { subcourseId_studentId: { subcourseId, studentId } } });
        logger.info(`Student(${studentId}) was deleted from Subcourse(${subcourseId}) by User(${context.user!.userID})`);
        return true;
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
            meeting = await createBBBMeeting(course.name, '' + subcourse.id, (await getUserTypeORM(context.user!.userID)) as Student | Pupil);
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

        const url = getMeetingUrl(
            '' + subcourse.id,
            `${context.user!.firstname} ${context.user!.lastname}`,
            isSessionStudent(context) || isElevated(context) ? meeting.moderatorPW : meeting.attendeePW
        );
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
        } /* else if (subcourse.published) {
            throw new ForbiddenError(`Lecture (${lecture.id}) of a published subcourse (${subcourse.id}) can't be deleted`);
        } */
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
        await joinSubcourse(subcourse, pupil, true);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async subcourseJoinManual(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('pupilId', { nullable: false }) pupilId: number
    ): Promise<boolean> {
        const pupil = await getSessionPupil(context, pupilId);
        const subcourse = await getSubcourse(subcourseId);
        await joinSubcourse(subcourse, pupil, false);
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

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseInviteGuest(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('firstname') firstname: string,
        @Arg('lastname') lastname: string,
        @Arg('email') email: string
    ) {
        email = validateEmail(email);

        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        const course = await getCourse(subcourse.courseId);

        const token = randomBytes(48).toString('hex');
        let inviterId: number | null = null;

        if (isSessionStudent(context)) {
            inviterId = context.user!.studentId;
        }

        // TODO: Move Guests from Course to Subcourse

        const guest = await prisma.course_guest.create({
            data: {
                firstname,
                lastname,
                email,
                token,
                inviterId,
                courseId: course.id,
            },
        });

        await sendGuestInvitationMail(guest);
        logger.info(`User(${context.user!.userID}) invited Guest(${email}) to Subcourse(${subcourse.id})`);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    async subcourseGuestJoin(@Arg('token') token: string) {
        const guest = await prisma.course_guest.findFirst({
            where: { token },
        });

        if (!guest) {
            throw new AuthenticationError(`Invalid guest token`);
        }

        const course = await prisma.course.findUniqueOrThrow({
            where: { id: guest.courseId },
        });

        // TODO: Adapt to subcourses
        const subcourse = await prisma.subcourse.findFirstOrThrow({
            where: { courseId: guest.courseId },
        });

        let meeting = await prisma.bbb_meeting.findFirst({ where: { meetingID: '' + subcourse.id } });
        if (!meeting) {
            throw new PrerequisiteError(`Meeting not started yet`);
        }

        if (meeting.alternativeUrl) {
            logger.info(`Guest(${guest.id}) joins meeting of Subcourse(${subcourse.id}) with alternative url '${meeting.alternativeUrl}'`);
            return meeting.alternativeUrl;
        }

        const isRunning = await isBBBMeetingRunning(meeting.meetingID);
        if (!isRunning) {
            throw new PrerequisiteError(`Meeting not started yet`);
        }

        const url = getMeetingUrl('' + subcourse.id, `${guest.firstname} ${guest.lastname}`, meeting.attendeePW);
        logger.info(`Guest(${guest.id}) joins meeting of Subcourse(${subcourse.id}) with url '${url}'`);
        return url;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.SUBCOURSE_PARTICIPANT)
    async subcourseNotifyInstructor(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId', (type) => Int) subcourseId: number,
        @Arg('title') title: string,
        @Arg('body') body: string,
        @Arg('fileIDs', (type) => [String]) fileIDs: string[]
    ) {
        const subcourse = await prisma.subcourse.findUniqueOrThrow({
            where: { id: subcourseId },
        });
        await hasAccess(context, 'Subcourse', subcourse);

        const course = await getCourse(subcourse.courseId);

        const pupil = await getSessionPupil(context);
        const files = fileIDs.map(getFile);

        await contactInstructors(course, subcourse, pupil, title, body, files);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async subcourseNotifyParticipants(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId', (type) => Int) subcourseId: number,
        @Arg('title') title: string,
        @Arg('body') body: string,
        @Arg('fileIDs', (type) => [String]) fileIDs: string[],
        @Arg('participantIDs', (type) => [Int]) participantIDs: number[]
    ) {
        const subcourse = await prisma.subcourse.findUniqueOrThrow({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);

        const course = await getCourse(subcourse.courseId);
        const instructor = await getSessionStudent(context);
        const files = fileIDs.map(getFile);

        await contactParticipants(course, subcourse, instructor, title, body, files, participantIDs);
        return true;
    }
}
