import { randomBytes } from 'crypto';
import moment from 'moment';
import * as TypeGraphQL from 'type-graphql';
import { Arg, Authorized, Ctx, InputType, Int, Mutation, Resolver } from 'type-graphql';
import {
    addGroupAppointmentsOrganizer,
    addGroupAppointmentsParticipant,
    removeGroupAppointmentsOrganizer,
    removeGroupAppointmentsParticipant,
} from '../../common/appointment/participants';
import { contactInstructors, contactParticipants } from '../../common/courses/contact';
import { fillSubcourse, joinSubcourse, joinSubcourseWaitinglist, leaveSubcourse, leaveSubcourseWaitinglist } from '../../common/courses/participants';
import { cancelSubcourse, editSubcourse, publishSubcourse } from '../../common/courses/states';
import { Pupil, Pupil as TypeORMPupil } from '../../common/entity/Pupil';
import { Student } from '../../common/entity/Student';
import { getLogger } from '../../common/logger/logger';
import { sendGuestInvitationMail, sendPupilCourseSuggestion } from '../../common/mails/courses';
import { prisma } from '../../common/prisma';
import { getUserIdTypeORM, getUserTypeORM } from '../../common/user';
import { createBBBMeeting, createOrUpdateCourseAttendanceLog, getMeetingUrl, isBBBMeetingRunning, startBBBMeeting } from '../../common/util/bbb';
import { PrerequisiteError } from '../../common/util/error';
import { getSessionPupil, getSessionStudent, isElevated, isSessionPupil, isSessionStudent } from '../authentication';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { GraphQLContext } from '../context';
import { AuthenticationError, ForbiddenError, UserInputError } from '../error';
import { getFile, removeFile } from '../files';
import * as GraphQLModel from '../generated/models';
import { getCourse, getLecture, getPupil, getStudent, getSubcourse } from '../util';
import { validateEmail } from '../validators';
import { chat_type } from '../generated';

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
    @TypeGraphQL.Field((_type) => Boolean)
    allowChatContactProspects!: boolean;
    @TypeGraphQL.Field((_type) => Boolean)
    allowChatContactParticipants!: boolean;
    @TypeGraphQL.Field((_type) => chat_type)
    groupChatType!: chat_type;
    @TypeGraphQL.Field((_type) => [PublicLectureInput], { nullable: true })
    lectures?: PublicLectureInput[];
}

@InputType()
class PublicSubcourseEditInput {
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int, { nullable: true })
    minGrade?: number;
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int, { nullable: true })
    maxGrade?: number;
    @TypeGraphQL.Field((_type) => TypeGraphQL.Int, { nullable: true })
    maxParticipants?: number;
    @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
    joinAfterStart?: boolean;
    @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
    allowChatContactProspects?: boolean;
    @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
    allowChatContactParticipants?: boolean;
    @TypeGraphQL.Field((_type) => chat_type, { nullable: true })
    groupChatType?: chat_type;
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

        const { joinAfterStart, minGrade, maxGrade, maxParticipants, lectures, allowChatContactParticipants, allowChatContactProspects, groupChatType } =
            subcourse;
        const result = await prisma.subcourse.create({
            data: {
                courseId,
                published: false,
                joinAfterStart,
                minGrade,
                maxGrade,
                maxParticipants,
                allowChatContactParticipants,
                allowChatContactProspects,
                groupChatType,
                lecture: { createMany: { data: lectures } },
            },
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
        const { user } = context;
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);
        const newInstructor = await getStudent(studentId);
        const studentUserId = getUserIdTypeORM(newInstructor);
        await prisma.subcourse_instructors_student.create({ data: { subcourseId, studentId } });
        await addGroupAppointmentsOrganizer(subcourseId, studentUserId);
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
        const { user } = context;
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);
        const instructorToBeRemoved = await getStudent(studentId);
        const studentUserId = getUserIdTypeORM(instructorToBeRemoved);
        await prisma.subcourse_instructors_student.delete({ where: { subcourseId_studentId: { subcourseId, studentId } } });
        await removeGroupAppointmentsOrganizer(subcourseId, studentUserId);
        logger.info(`Student(${studentId}) was deleted from Subcourse(${subcourseId}) by User(${context.user!.userID})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcoursePublish(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);

        await hasAccess(context, 'Subcourse', subcourse);

        await publishSubcourse(subcourse);
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
        const subcourse = await getSubcourse(subcourseId, true);
        await hasAccess(context, 'Subcourse', subcourse);

        return await editSubcourse(subcourse, data);
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcourseCancel(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        await cancelSubcourse(subcourse);

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
            where: { meetingID: ('' + subcourse.id).padStart(2, '0') },
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
                meetingID: ('' + subcourse.id).padStart(2, '0'),
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

        let meeting = await prisma.bbb_meeting.findFirst({ where: { meetingID: ('' + subcourse.id).padStart(2, '0') } });
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

        let currentDate = moment();
        if (moment(lecture.start).isBefore(currentDate)) {
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

        if (subcourse.published) {
            let currentDate = moment();
            if (moment(lecture.start).isBefore(currentDate)) {
                throw new ForbiddenError(`Past lecture (${lecture.id}) of subcourse (${subcourse.id}) can't be deleted.`);
            }
            const lectureCount = await prisma.lecture.count({ where: { subcourseId: subcourse.id } });
            if (lectureCount <= 1) {
                throw new ForbiddenError(`Last Lecture(${lecture.id}) of published Subcourse(${subcourse.id}) cannot be deleted`);
            }
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
        const { user } = context;
        const pupil = await getSessionPupil(context, pupilId);
        const subcourse = await getSubcourse(subcourseId);
        await joinSubcourse(subcourse, pupil, true);
        await addGroupAppointmentsParticipant(subcourseId, user.userID);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async subcourseJoinManual(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('pupilId', { nullable: false }) pupilId: number
    ): Promise<boolean> {
        const { user } = context;
        const pupil = await getSessionPupil(context, pupilId);
        const subcourse = await getSubcourse(subcourseId);
        await joinSubcourse(subcourse, pupil, false);
        await addGroupAppointmentsParticipant(subcourseId, user.userID);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async subcourseJoinFromWaitinglist(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('pupilId', { nullable: false }) pupilId: number
    ) {
        const { user } = context;
        let subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);
        const pupil = await getPupil(pupilId);

        const isOnWaitingList = (await prisma.subcourse_waiting_list_pupil.count({ where: { pupilId: pupil.id, subcourseId: subcourse.id } })) > 0;
        if (!isOnWaitingList) {
            throw new PrerequisiteError(
                `Pupil(${pupil.id}) is not on the waitinglist of the Subcourse(${subcourse.id}) and can thus not be joined by the instructor`
            );
        }

        const participantCount = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });
        if (participantCount >= subcourse.maxParticipants) {
            // Course is full, create one single place for the pupil
            subcourse = await prisma.subcourse.update({ where: { id: subcourse.id }, data: { maxParticipants: { increment: 1 } }, include: { lecture: true } });
        }

        // Joining the subcourse will automatically remove the pupil from the waitinglist
        await joinSubcourse(subcourse, pupil, true);
        await addGroupAppointmentsParticipant(subcourseId, user.userID);

        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.SUBCOURSE_PARTICIPANT)
    async subcourseLeave(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('pupilId', { nullable: true }) pupilId?: number
    ): Promise<boolean> {
        const { user } = context;
        const pupil = await getSessionPupil(context, pupilId);
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        await leaveSubcourse(subcourse, pupil);
        await removeGroupAppointmentsParticipant(subcourse.id, user.userID);
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

        let meeting = await prisma.bbb_meeting.findFirst({ where: { meetingID: ('' + subcourse.id).padStart(2, '0') } });
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
        for (const fileID in fileIDs) {
            removeFile(fileID);
        }
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
        for (const fileID in fileIDs) {
            removeFile(fileID);
        }

        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.INSTRUCTOR)
    async subcoursePromote(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);
        const course = await getCourse(subcourse.courseId);

        await hasAccess(context, 'Subcourse', subcourse);
        await sendPupilCourseSuggestion(course, subcourse, 'available_places_on_subcourse');
        await prisma.subcourse.update({ data: { alreadyPromoted: true }, where: { id: subcourse.id } });

        return true;
    }
}
