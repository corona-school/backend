import { Role } from '../authorizations';
import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, Resolver } from 'type-graphql';
import { GraphQLContext } from '../context';
import { pupil_registrationsource_enum as RegistrationSource } from '@prisma/client';
import { getSessionPupil, getSessionStudent, getSessionUser, isSessionPupil, isSessionStudent, loginAsUser, updateSessionUser } from '../authentication';
import { activatePupil, deactivatePupil } from '../../common/pupil/activation';
import { MaxLength, ValidateNested } from 'class-validator';
import { RateLimit } from '../rate-limit';
import { becomeInstructor, BecomeInstructorData, becomeTutor, registerStudent } from '../../common/student/registration';
import { becomeStatePupil, BecomeStatePupilData, becomeTutee, becomeParticipant, registerPupil } from '../../common/pupil/registration';
import '../types/enums';
import { PrerequisiteError } from '../../common/util/error';
import { userForStudent, userForPupil } from '../../common/user';
import { Pupil, Student } from '../generated';
import { UserInputError } from 'apollo-server-express';
import { UserType } from '../types/user';
import { StudentUpdateInput, updateStudent } from '../student/mutations';
import { PupilUpdateInput, updatePupil } from '../pupil/mutations';
import { NotificationPreferences } from '../types/preferences';
import { deactivateStudent } from '../../common/student/activation';
import { ValidateEmail } from '../validators';
import { getLogger } from '../../common/logger/logger';
import { GraphQLBoolean } from 'graphql';
import { BecomeTuteeInput, BecomeTutorInput, RegisterPupilInput, RegisterStudentInput } from '../types/userInputs';
import { evaluatePupilRoles, evaluateStudentRoles } from '../../common/user/evaluate_roles';
import { verifyEmail } from '../../common/secret';
import { createIDPLogin } from '../../common/secret/idp';
import { CalendarPreferences } from '../types/calendarPreferences';

@InputType()
class MeUpdateInput {
    @Field((type) => String, { nullable: true })
    @MaxLength(100)
    firstname?: string;

    @Field((type) => String, { nullable: true })
    @MaxLength(100)
    lastname?: string;

    @Field((type) => Date, { nullable: true })
    lastTimeCheckedNotifications?: Date;

    @Field((type) => NotificationPreferences, { nullable: true })
    notificationPreferences?: NotificationPreferences;

    @Field((type) => CalendarPreferences, { nullable: true })
    calendarPreferences?: CalendarPreferences;

    @Field((type) => PupilUpdateInput, { nullable: true })
    @ValidateNested()
    pupil?: PupilUpdateInput;

    @Field((type) => StudentUpdateInput, { nullable: true })
    @ValidateNested()
    student?: StudentUpdateInput;
}

@InputType()
class BecomeInstructorInput implements BecomeInstructorData {
    @Field((type) => String, { nullable: true })
    @MaxLength(3000)
    message?: string;
}

@InputType()
class BecomeStatePupilInput implements BecomeStatePupilData {
    @Field((type) => String)
    @ValidateEmail()
    teacherEmail: string;
    @Field((type) => Int, { nullable: true })
    gradeAsInt?: number;
}

const logger = getLogger('Me Mutations');

@Resolver((of) => UserType)
export class MutateMeResolver {
    @Mutation((returns) => Student)
    @Authorized(Role.UNAUTHENTICATED, Role.ADMIN, Role.SSO_REGISTERING_USER)
    @RateLimit('RegisterStudent', 10 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async meRegisterStudent(
        @Ctx() context: GraphQLContext,
        @Arg('data') data: RegisterStudentInput,
        @Arg('noEmail', () => GraphQLBoolean, { nullable: true }) noEmail = false
    ) {
        const sessionUser = context.user;
        const byAdmin = context.user.roles.includes(Role.ADMIN);
        // User registered after trying to log in via IDP, pick up the IDP user info
        const isSSO = context.user.roles.includes(Role.SSO_REGISTERING_USER);

        if (data.registrationSource === RegistrationSource.plus && !byAdmin) {
            throw new UserInputError('Lern-Fair Plus students may only be registered by admins');
        }

        if (isSSO && (!sessionUser.idpClientId || !sessionUser.idpSub)) {
            throw new Error(`Cannot complete request without an IDP ClientID / IDP Sub`);
        }

        const student = await registerStudent({ ...data, email: isSSO ? sessionUser.email : data.email }, noEmail);
        logger.info(`Student(${student.id}, firstname = ${student.firstname}, lastname = ${student.lastname}) registered`);
        if (isSSO) {
            const user = userForStudent(student);
            // We assume here that the IDP already validated the email
            await verifyEmail(user);
            await createIDPLogin(user.userID, sessionUser.idpSub, sessionUser.idpClientId);
        }

        if (!byAdmin) {
            await loginAsUser(userForStudent(student), context, undefined);
        }

        return student;

        /* The student can now use the authToken passed to them via E-Mail to re authenticate the session and have their E-Mail verified
           This session now also has the STUDENT role.
           With this role, they can use the meBecomeTutor, meBecomeInstructor or meBecomeProjectCoach to enhance their user account.
           With the STUDENT Role alone they can't do much (but at least deactivate their account and change their settings) */
    }

    @Mutation((returns) => Pupil)
    @Authorized(Role.UNAUTHENTICATED, Role.ADMIN, Role.SSO_REGISTERING_USER)
    @RateLimit('RegisterPupil', 10 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async meRegisterPupil(
        @Ctx() context: GraphQLContext,
        @Arg('data') data: RegisterPupilInput,
        @Arg('noEmail', () => GraphQLBoolean, { nullable: true }) noEmail = false
    ) {
        const sessionUser = context.user;
        const byAdmin = context.user.roles.includes(Role.ADMIN);
        const isSSO = context.user.roles.includes(Role.SSO_REGISTERING_USER);

        if (data.registrationSource === RegistrationSource.plus && !byAdmin) {
            throw new UserInputError('Lern-Fair Plus pupils may only be registered by admins');
        }

        if (isSSO && (!sessionUser.idpClientId || !sessionUser.idpSub)) {
            throw new Error(`Cannot complete request without an IDP ClientID / IDP Sub`);
        }

        const pupil = await registerPupil({ ...data, email: isSSO ? sessionUser.email : data.email }, noEmail);
        logger.info(`Pupil(${pupil.id}, firstname = ${pupil.firstname}, lastname = ${pupil.lastname}) registered`);
        if (isSSO) {
            const user = userForPupil(pupil);
            // We assume here that the IDP already validated the email
            await verifyEmail(user);
            await createIDPLogin(user.userID, sessionUser.idpSub, sessionUser.idpClientId);
        }

        if (!byAdmin) {
            await loginAsUser(userForPupil(pupil), context, undefined);
        }

        return pupil;

        /* The pupil can now use the authToken passed to them via E-Mail to re authenticate the session.
           This will mark them as verified, and grant them the PUPIL role.
           With this role, they can use the meBecomeStatePupil, meBecomeTutee or meBecomeProjectCoachee to enhance their user account */
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async meUpdate(@Ctx() context: GraphQLContext, @Arg('update') update: MeUpdateInput) {
        const { firstname, lastname, lastTimeCheckedNotifications, notificationPreferences, calendarPreferences, pupil, student } = update;

        if (isSessionPupil(context)) {
            const prevPupil = await getSessionPupil(context);

            if (student) {
                throw new PrerequisiteError(`Tried to update student data on a pupil`);
            }

            await updatePupil(context, prevPupil, {
                firstname,
                lastname,
                lastTimeCheckedNotifications,
                notificationPreferences,
                calendarPreferences,
                ...pupil,
            });
            return true;
        }

        if (isSessionStudent(context)) {
            const prevStudent = await getSessionStudent(context);

            if (pupil) {
                throw new PrerequisiteError(`Tried to update pupil data on student`);
            }

            await updateStudent(context, prevStudent, { lastTimeCheckedNotifications, notificationPreferences, calendarPreferences, ...student });

            return true;
        }

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async meDeactivate(@Ctx() context: GraphQLContext, @Arg('reason', { nullable: true }) reason?: string) {
        if (isSessionPupil(context)) {
            const pupil = await getSessionPupil(context);
            const updatedPupil = await deactivatePupil(pupil, false, reason, false);

            const roles: Role[] = [];
            await evaluatePupilRoles(updatedPupil, roles);
            context.user = { ...context.user, roles };

            logger.info(`Pupil(${pupil.id}) deactivated their account`);

            return true;
        }

        if (isSessionStudent(context)) {
            const student = await getSessionStudent(context);
            const updatedStudent = await deactivateStudent(student, false, reason);

            const roles: Role[] = [];
            await evaluateStudentRoles(updatedStudent, roles);
            context.user = { ...context.user, roles };

            logger.info(`Student(${student.id}) deactivated their account`);
            return true;
        }

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async meActivate(@Ctx() context: GraphQLContext) {
        if (isSessionPupil(context)) {
            const pupil = await getSessionPupil(context);
            const updatedPupil = await activatePupil(pupil);

            const roles: Role[] = [];
            await evaluatePupilRoles(updatedPupil, roles);
            context.user = { ...context.user, roles };

            logger.info(`Pupil(${pupil.id}) reactivated their account`);

            return true;
        }

        // TODO: Student activation

        throw new Error(`This mutation is currently not supported for this user type`);
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.STUDENT)
    async meBecomeInstructor(
        @Ctx() context: GraphQLContext,
        @Arg('data', { nullable: true }) data: BecomeInstructorInput,
        @Arg('studentId', { nullable: true }) studentId: number
    ) {
        const student = await getSessionStudent(context, studentId);

        await becomeInstructor(student, data);
        logger.info(`Student(${student.id}) requested to become an instructor`);

        // User gets the WANNABE_INSTRUCTOR role
        await updateSessionUser(context, userForStudent(student), getSessionUser(context).deviceId);

        // After successful screening and re authentication, the user will receive the INSTRUCTOR role

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.STUDENT, Role.ADMIN)
    async meBecomeTutor(
        @Ctx() context: GraphQLContext,
        @Arg('data', { nullable: true }) data: BecomeTutorInput,
        @Arg('studentId', { nullable: true }) studentId: number
    ) {
        const student = await getSessionStudent(context, studentId);

        await becomeTutor(student, data);

        // User gets the WANNABE_TUTOR role
        await updateSessionUser(context, userForStudent(student), getSessionUser(context).deviceId);

        // After successful screening and re authentication, the user will receive the TUTOR role

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.PUPIL, Role.ADMIN)
    async meBecomeTutee(@Ctx() context: GraphQLContext, @Arg('data') data: BecomeTuteeInput, @Arg('pupilId', { nullable: true }) pupilId: number) {
        const byAdmin = context.user.roles.includes(Role.ADMIN);

        const pupil = await getSessionPupil(context, pupilId);
        const updatedPupil = await becomeTutee(pupil, data);
        if (!byAdmin) {
            const roles: Role[] = [];
            await evaluatePupilRoles(updatedPupil, roles);
            context.user = { ...context.user, roles };
        }

        logger.info(byAdmin ? `An admin upgraded the account of pupil(${pupil.id}) to a TUTEE` : `Pupil(${pupil.id}) upgraded their account to a TUTEE`);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.PUPIL, Role.ADMIN)
    async meBecomeStatePupil(@Ctx() context: GraphQLContext, @Arg('data') data: BecomeStatePupilInput, @Arg('pupilId', { nullable: true }) pupilId: number) {
        const pupil = await getSessionPupil(context, pupilId);

        const updatedPupil = await becomeStatePupil(pupil, data);
        const roles: Role[] = [];
        await evaluatePupilRoles(updatedPupil, roles);
        context.user = { ...context.user, roles };

        logger.info(`Pupil(${pupil.id}) upgraded their account to become a STATE_PUPIL`);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.PUPIL, Role.ADMIN)
    async meBecomeParticipant(@Ctx() context: GraphQLContext, @Arg('pupilId', { nullable: true }) pupilId: number) {
        const pupil = await getSessionPupil(context, pupilId);

        const updatedPupil = await becomeParticipant(pupil);
        const roles: Role[] = [];
        await evaluatePupilRoles(updatedPupil, roles);
        context.user = { ...context.user, roles };

        logger.info(`Pupil(${pupil.id}) upgraded their account to become a PARTICIPANT`);

        return true;
    }
}
