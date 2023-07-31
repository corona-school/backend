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
import { getLogger } from '../../common/logger/logger';
import { sendPupilCoursePromotion } from '../../common/mails/courses';
import { prisma } from '../../common/prisma';
import { getUserIdTypeORM, userForPupil, userForStudent } from '../../common/user';
import { PrerequisiteError } from '../../common/util/error';
import { getSessionPupil, getSessionStudent, isSessionStudent } from '../authentication';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { GraphQLContext } from '../context';
import { getFile, removeFile } from '../files';
import * as GraphQLModel from '../generated/models';
import { getCourse, getPupil, getStudent, getSubcourse } from '../util';
import { validateEmail } from '../validators';
import { chat_type } from '../generated';
import { addParticipant, markConversationAsReadOnly, removeParticipantFromCourseChat } from '../../common/chat/conversation';
import { ChatType } from '../../common/chat/types';

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
    @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
    allowChatContactProspects?: boolean;
    @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
    allowChatContactParticipants?: boolean;
    @TypeGraphQL.Field((_type) => chat_type, { nullable: true })
    groupChatType?: chat_type;
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
                lecture: { createMany: { data: lectures || [] } },
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
        const newInstructorUser = userForStudent(newInstructor);
        const studentUserId = getUserIdTypeORM(newInstructor);
        await prisma.subcourse_instructors_student.create({ data: { subcourseId, studentId } });
        await addGroupAppointmentsOrganizer(subcourseId, studentUserId);
        if (subcourse.conversationId) {
            await addParticipant(newInstructorUser, subcourse.conversationId, subcourse.groupChatType as ChatType);
        }

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
        const instructorUser = userForStudent(instructorToBeRemoved);
        const studentUserId = getUserIdTypeORM(instructorToBeRemoved);
        await prisma.subcourse_instructors_student.delete({ where: { subcourseId_studentId: { subcourseId, studentId } } });
        await removeGroupAppointmentsOrganizer(subcourseId, studentUserId);
        if (subcourse.conversationId) {
            await removeParticipantFromCourseChat(instructorUser, subcourse.conversationId);
        }
        logger.info(`Student(${studentId}) was deleted from Subcourse(${subcourseId}) by User(${context.user!.userID})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async subcoursePublish(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number): Promise<Boolean> {
        const subcourse = await getSubcourse(subcourseId);

        await hasAccess(context, 'Subcourse', subcourse);

        await publishSubcourse(subcourse);
        await sendPupilCoursePromotion(subcourse);
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
        const { user } = context;
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        await cancelSubcourse(user, subcourse);
        if (subcourse.conversationId) {
            await markConversationAsReadOnly(subcourse.conversationId);
        }
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
        if (subcourse.conversationId) {
            await addParticipant(user, subcourse.conversationId, subcourse.groupChatType as ChatType);
        }

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
        await addParticipant(user, subcourse.conversationId, subcourse.groupChatType as ChatType);
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

        const isOnWaitingList = (await prisma.waiting_list_enrollment.count({ where: { pupilId: pupil.id, subcourseId: subcourse.id } })) > 0;
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
        if (subcourse.conversationId) {
            await addParticipant(user, subcourse.conversationId, subcourse.groupChatType as ChatType);
        }

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
        const pupilUser = userForPupil(pupil);
        const subcourse = await getSubcourse(subcourseId);
        await hasAccess(context, 'Subcourse', subcourse);

        await leaveSubcourse(subcourse, pupil);
        await removeGroupAppointmentsParticipant(subcourse.id, user.userID);
        if (subcourse.conversationId) {
            await removeParticipantFromCourseChat(pupilUser, subcourse.conversationId);
        }

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

        await hasAccess(context, 'Subcourse', subcourse);
        await sendPupilCoursePromotion(subcourse);
        await prisma.subcourse.update({ data: { alreadyPromoted: true }, where: { id: subcourse.id } });

        return true;
    }
}
