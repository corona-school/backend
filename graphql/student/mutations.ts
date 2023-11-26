import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import { ensureNoNull, getStudent } from '../util';
import { deactivateStudent, reactivateStudent } from '../../common/student/activation';
import { canStudentRequestMatch, createStudentMatchRequest, deleteStudentMatchRequest } from '../../common/match/request';
import { getSessionScreener, getSessionStudent, isElevated, updateSessionUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, ObjectType, Resolver } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { addInstructorScreening, addTutorScreening, cancelCoCReminders, scheduleCoCReminders } from '../../common/student/screening';
import { becomeTutor, ProjectFieldWithGradeData, registerStudent } from '../../common/student/registration';
import { Subject } from '../types/subject';
import {
    pupil_projectfields_enum as ProjectField,
    pupil_registrationsource_enum as RegistrationSource,
    student as Student,
    student_state_enum as State,
    student_languages_enum as Language,
    PrismaClient,
    Prisma,
} from '@prisma/client';
import { setProjectFields } from '../../common/student/update';
import { PrerequisiteError, RedundantError } from '../../common/util/error';
import { toStudentSubjectDatabaseFormat } from '../../common/util/subjectsutils';
import { userForStudent } from '../../common/user';
import { MaxLength } from 'class-validator';
import { NotificationPreferences } from '../types/preferences';
import { getLogger } from '../../common/logger/logger';
import { createRemissionRequestPDF } from '../../common/remission-request';
import { getFileURL, addFile } from '../files';
import { validateEmail, ValidateEmail } from '../validators';
const log = getLogger(`StudentMutation`);
import { screening_jobstatus_enum } from '../../graphql/generated';
import { createZoomUser, deleteZoomUser } from '../../common/zoom/user';
import { GraphQLJSON } from 'graphql-scalars';
import { BecomeTutorInput, RegisterStudentInput } from '../types/userInputs';

@InputType('Instructor_screeningCreateInput', {
    isAbstract: true,
})
export class ScreeningInput {
    @Field((_type) => Boolean, {
        nullable: false,
    })
    success!: boolean;

    @Field((_type) => String, {
        nullable: true,
    })
    comment?: string | undefined;

    @Field((_type) => screening_jobstatus_enum, {
        nullable: true,
    })
    jobStatus?: screening_jobstatus_enum | undefined;

    @Field((_type) => String, {
        nullable: true,
    })
    knowsCoronaSchoolFrom?: string | undefined;
}

@ObjectType()
class StudentRegisterPlusManyOutput {
    @Field((_type) => String, { nullable: true })
    email?: string;

    @Field((_type) => Boolean, { nullable: false })
    success?: boolean;

    @Field((_type) => String, { nullable: true })
    reason?: string;
}

@InputType()
class StudentRegisterPlusInput {
    @Field((type) => String) // required to identify student even when registration is not desired
    email: string;

    @Field((type) => RegisterStudentInput, { nullable: true })
    register?: RegisterStudentInput;

    @Field((type) => BecomeTutorInput, { nullable: true })
    activate?: BecomeTutorInput;

    @Field((type) => ScreeningInput, { nullable: true })
    screen?: ScreeningInput;
}

@InputType()
class StudentRegisterPlusManyInput {
    @Field((type) => [StudentRegisterPlusInput])
    entries: StudentRegisterPlusInput[];
}

@InputType()
export class ProjectFieldWithGradeInput implements ProjectFieldWithGradeData {
    @Field((type) => ProjectField)
    projectField: ProjectField;
    @Field((type) => Int, { nullable: true })
    min: number;
    @Field((type) => Int, { nullable: true })
    max: number;
}

@InputType()
export class StudentUpdateInput {
    @Field((type) => String, { nullable: true })
    firstname?: string;

    @Field((type) => String, { nullable: true })
    lastname?: string;

    @Field((type) => String, { nullable: true })
    @ValidateEmail()
    email?: string;

    @Field((type) => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field((type) => [ProjectFieldWithGradeInput], { nullable: true })
    projectFields?: ProjectFieldWithGradeInput[];

    @Field((type) => RegistrationSource, { nullable: true })
    registrationSource?: RegistrationSource;

    @Field((type) => State, { nullable: true })
    state?: State;

    @Field((type) => String, { nullable: true })
    @MaxLength(500)
    aboutMe?: string;

    @Field((type) => Date, { nullable: true })
    lastTimeCheckedNotifications?: Date;

    @Field((type) => NotificationPreferences, { nullable: true })
    notificationPreferences?: NotificationPreferences;

    @Field((type) => [Language], { nullable: true })
    languages?: Language[];

    @Field((type) => String, { nullable: true })
    university?: string;
}

const logger = getLogger('Student Mutations');

export async function updateStudent(
    context: GraphQLContext,
    student: Student,
    update: StudentUpdateInput,
    prismaInstance: Prisma.TransactionClient | PrismaClient = prisma
) {
    const {
        firstname,
        lastname,
        email,
        projectFields,
        subjects,
        registrationSource,
        state,
        aboutMe,
        languages,
        lastTimeCheckedNotifications,
        notificationPreferences,
        university,
    } = update;

    if (projectFields && !student.isProjectCoach) {
        throw new PrerequisiteError(`Only project coaches can set the project fields`);
    }

    if (registrationSource != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`RegistrationSource may only be changed by elevated users`);
    }

    if (email != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`Only Admins may change the email without verification`);
    }

    if ((firstname != undefined || lastname != undefined) && !isElevated(context)) {
        throw new PrerequisiteError(`Only Admins may change the name without verification`);
    }

    if (projectFields) {
        await setProjectFields(student, projectFields);
    }

    const res = await prismaInstance.student.update({
        data: {
            firstname: ensureNoNull(firstname),
            lastname: ensureNoNull(lastname),
            email: ensureNoNull(email),
            subjects: subjects ? JSON.stringify(subjects.map(toStudentSubjectDatabaseFormat)) : undefined,
            registrationSource: ensureNoNull(registrationSource),
            state: ensureNoNull(state),
            aboutMe: ensureNoNull(aboutMe),
            lastTimeCheckedNotifications: ensureNoNull(lastTimeCheckedNotifications),
            notificationPreferences: ensureNoNull(notificationPreferences),
            languages: ensureNoNull(languages),
            university: ensureNoNull(university),
        },
        where: { id: student.id },
    });

    // The email, firstname or lastname might have changed, so it is a good idea to refresh the session
    await updateSessionUser(context, userForStudent(res));

    logger.info(`Student(${student.id}) updated their account with ${JSON.stringify(update)}`);
    return res;
}

async function studentRegisterPlus(data: StudentRegisterPlusInput, ctx: GraphQLContext): Promise<{ success: boolean; reason: string }> {
    let { email } = data;
    const { register, activate, screen } = data;
    const screener = await getSessionScreener(ctx);

    try {
        email = validateEmail(email);

        if (register) {
            register.email = validateEmail(register.email);
            if (register.email !== email) {
                throw new PrerequisiteError(`Identifying email is different from email used in registration data`);
            }
        }

        const existingAccount = await prisma.student.findUnique({ where: { email } });

        if (!register && !existingAccount) {
            throw new PrerequisiteError(`Account with email ${email} doesn't exist and no registration data was provided`);
        }

        await prisma.$transaction(async (tx) => {
            let student = existingAccount;
            if (register) {
                //registration data was provided
                if (student) {
                    log.info(`Account with email ${email} already exists, updating account with registration data instead... Student(${student.id})`);
                    // updating existing account with new registration data:
                    student = await updateStudent(ctx, student, { ...register }, tx); // languages are added in next step (becomeTutor)
                } else {
                    student = await registerStudent(register, true, tx);
                    log.info(`Registered account with email ${email}. Student(${student.id})`);
                }
            }

            if (!!activate && !student.isStudent) {
                // activation data was provided; student isn't a tutor yet
                student = await becomeTutor(student, activate, tx, true);
                logger.info(`Made account with email ${email} a tutor. Student(${student.id})`);
            } else if (activate) {
                // activation data was provided but student already is a tutor
                logger.info(`Account with email ${email} is already a tutor, updating student with activation data... Student(${student.id})`);
                // update existing account with new activation data:
                student = await updateStudent(ctx, student, { ...activate }, tx);
            }

            if (screen) {
                // screening data was provided
                const canRequest = await canStudentRequestMatch(student);
                if (!canRequest.allowed && canRequest.reason === 'not-screened') {
                    await addTutorScreening(screener, student, screen, tx, true);
                    log.info(`Screened account with email ${email}. Student(${student.id})`);
                } else if (!canRequest.allowed) {
                    throw new PrerequisiteError(`Screening error: ${canRequest.reason}. Student(${student.id})`);
                } else {
                    log.info(`Account with email ${email} is already screened. Student(${student.id})`);
                }
            }
        });
    } catch (e) {
        log.error(`Error while registering student ${email}, skipping this one`, e);
        return { success: false, reason: e.publicMessage || e.toString() };
    }
    return { success: true, reason: '' };
}

@Resolver((of) => GraphQLModel.Student)
export class MutateStudentResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.STUDENT, Role.ADMIN)
    async studentUpdate(@Ctx() context: GraphQLContext, @Arg('data') data: StudentUpdateInput, @Arg('studentId', { nullable: true }) studentId?: number) {
        const student = await getSessionStudent(context, studentId);
        await updateStudent(context, student, data);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentDeactivate(@Arg('studentId') studentId: number): Promise<boolean> {
        const student = await getStudent(studentId);
        await deactivateStudent(student);
        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN)
    async studentReactivate(@Arg('studentId') studentId: number, @Arg('reason') reason: string): Promise<boolean> {
        const student = await getStudent(studentId);
        await reactivateStudent(student, reason);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TUTOR)
    async studentCreateMatchRequest(@Ctx() context: GraphQLContext, @Arg('studentId', { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, /* elevated override */ studentId);

        await createStudentMatchRequest(student, isElevated(context));

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TUTOR)
    async studentDeleteMatchRequest(@Ctx() context: GraphQLContext, @Arg('studentId', { nullable: true }) studentId?: number): Promise<boolean> {
        const student = await getSessionStudent(context, /* elevated override */ studentId);
        await deleteStudentMatchRequest(student);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentInstructorScreeningCreate(
        @Ctx() context: GraphQLContext,
        @Arg('studentId') studentId: number,
        @Arg('screening') screening: ScreeningInput,
        @Arg('skipCoC', { nullable: true }) skipCoC?: boolean
    ) {
        const student = await getStudent(studentId);

        if (!student.isInstructor) {
            await prisma.student.update({ data: { isInstructor: true }, where: { id: student.id } });
            log.info(`Student(${student.id}) was screened as an instructor, so we assume they also want to be an instructor`);
        }

        const screener = await getSessionScreener(context);
        await addInstructorScreening(screener, student, screening, !!skipCoC);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentTutorScreeningCreate(@Ctx() context: GraphQLContext, @Arg('studentId') studentId: number, @Arg('screening') screening: ScreeningInput) {
        const student = await getStudent(studentId);

        if (!student.isStudent) {
            await prisma.student.update({ data: { isStudent: true }, where: { id: student.id } });
            log.info(`Student(${student.id}) was screened as a tutor, so we assume they also want to be tutor`);
        }

        const screener = await getSessionScreener(context);
        await addTutorScreening(screener, student, screening);
        return true;
    }

    @Mutation((returns) => [StudentRegisterPlusManyOutput])
    @Authorized(Role.ADMIN, Role.SCREENER)
    async studentRegisterPlusMany(@Ctx() context: GraphQLContext, @Arg('data') data: StudentRegisterPlusManyInput) {
        const { entries } = data;
        log.info(`Starting studentRegisterPlusMany, received ${entries.length} students`);
        const results = [];
        for (const entry of entries) {
            const res = await studentRegisterPlus(entry, context);
            results.push({ email: entry.email, ...res });
        }
        log.info(
            `studentRegisterPlusMany has finished. Count of successful students handled: ${results.filter((s) => s.success).length}. Failed count: ${
                results.filter((s) => s.success).length
            }`
        );
        log.info('register plus many results', { results: JSON.stringify(results, null, 4) });
        return results;
    }

    @Mutation((returns) => String)
    @Authorized(Role.STUDENT)
    async studentGetRemissionRequestAsPDF(@Ctx() context: GraphQLContext) {
        const student = await getSessionStudent(context);
        const pdf = await createRemissionRequestPDF(student);

        if (!pdf) {
            throw new Error(`No Remission Request issued for Student(${student.id}) so far`);
        }

        const file = addFile({
            buffer: pdf,
            mimetype: 'application/pdf',
            originalname: 'Zertifikat.pdf',
            size: pdf.length,
        });
        return getFileURL(file);
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN)
    async studentRequestCoC(@Arg('studentId') studentId: number) {
        const student = await getStudent(studentId);
        await scheduleCoCReminders(student, true);
        log.info(`Scheduled CoC reminder for Student(${studentId})`);
        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN)
    async studentCancelCoC(@Arg('studentId') studentId: number) {
        const student = await getStudent(studentId);
        await cancelCoCReminders(student);

        log.info(`Cancelled CoC reminder for Student(${studentId})`);
        return true;
    }

    @Mutation(() => GraphQLJSON)
    @Authorized(Role.ADMIN)
    async studentCreateZoomUser(@Arg('studentId') studentId: number) {
        const student = await getStudent(studentId);
        if (student.zoomUserId) {
            throw new RedundantError('Student already has a Zoom User');
        }

        const zoomUser = await createZoomUser(student);
        log.info(`Admin created a Zoom User for Student(${student.id})`);
        return zoomUser;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN)
    async studentDeleteZoomUser(@Arg('studentId') studentId: number) {
        const student = await getStudent(studentId);
        if (!student.zoomUserId) {
            throw new RedundantError('Student does not have a Zoom User');
        }

        const hasAppointmentsWithZoomMeeting =
            (await prisma.lecture.count({
                where: {
                    organizerIds: { has: userForStudent(student).userID },
                    zoomMeetingId: { not: null },
                    start: { gte: new Date() },
                },
            })) > 0;

        if (hasAppointmentsWithZoomMeeting) {
            throw new PrerequisiteError('Cannot delete Zoom User for Student with scheduled Zoom Meetings');
        }

        await deleteZoomUser(student);
        logger.info(`Admin deleted the Zoom User of Student(${student.id})`);
        return true;
    }
}
