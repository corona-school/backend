import { Resolver, Mutation, Arg, Authorized, Ctx, InputType, ObjectType, Field, Int } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { activatePupil, deactivatePupil } from '../../common/pupil/activation';
import { Role } from '../authorizations';
import { ensureNoNull, getPupil } from '../util';
import * as Notification from '../../common/notification';
import { createPupilMatchRequest, deletePupilMatchRequest } from '../../common/match/request';
import { GraphQLContext } from '../context';
import { getSessionPupil, getSessionScreener, isElevated, updateSessionUser } from '../authentication';
import { Subject } from '../types/subject';
import {
    Prisma,
    PrismaClient,
    pupil as Pupil,
    pupil_projectfields_enum as ProjectField,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_schooltype_enum as SchoolType,
    pupil_languages_enum as Language,
    pupil_screening_status_enum as PupilScreeningStatus,
    pupil_state_enum as State,
} from '@prisma/client';
import { prisma } from '../../common/prisma';
import { PrerequisiteError } from '../../common/util/error';
import { toPupilSubjectDatabaseFormat } from '../../common/util/subjectsutils';
import { userForPupil, userForScreener } from '../../common/user';
import { MaxLength } from 'class-validator';
import { becomeTutee, registerPupil } from '../../common/pupil/registration';
import { NotificationPreferences } from '../types/preferences';
import { addPupilScreening, updatePupilScreening } from '../../common/pupil/screening';
import { invalidatePupilScreening } from '../../common/pupil/screening';
import { validateEmail, ValidateEmail } from '../validators';
import { getLogger } from '../../common/logger/logger';
import { RegisterPupilInput, BecomeTuteeInput } from '../types/userInputs';

const logger = getLogger(`Pupil Mutations`);

@InputType()
export class PupilUpdateInput {
    @Field((type) => String, { nullable: true })
    firstname?: string;

    @Field((type) => String, { nullable: true })
    lastname?: string;

    @Field((type) => String, { nullable: true })
    @ValidateEmail()
    email?: string;

    @Field((type) => Int, { nullable: true })
    gradeAsInt?: number;

    @Field((type) => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field((type) => [ProjectField], { nullable: true })
    projectFields?: ProjectField[];

    @Field((type) => RegistrationSource, { nullable: true })
    registrationSource?: RegistrationSource;

    @Field((type) => State, { nullable: true })
    state?: State;

    @Field((type) => SchoolType, { nullable: true })
    schooltype?: SchoolType;

    @Field((type) => [Language], { nullable: true })
    languages?: Language[];

    @Field((type) => String, { nullable: true })
    @MaxLength(500)
    aboutMe?: string;

    @Field((type) => Date, { nullable: true })
    lastTimeCheckedNotifications?: Date;

    @Field((type) => NotificationPreferences, { nullable: true })
    notificationPreferences?: NotificationPreferences;

    @Field((type) => String, { nullable: true })
    @MaxLength(500)
    matchReason?: string;
}

@InputType()
export class PupilScreeningUpdateInput {
    @Field(() => PupilScreeningStatus, { nullable: true })
    status?: PupilScreeningStatus;

    @Field(() => String, { nullable: true })
    comment?: string;
}

@InputType()
class PupilRegisterPlusInput {
    @Field(() => String) // required to identify pupil even when registration is not desired
    email: string;

    @Field((type) => RegisterPupilInput, { nullable: true })
    register?: RegisterPupilInput;

    @Field((type) => BecomeTuteeInput, { nullable: true })
    activate?: BecomeTuteeInput;
}

@ObjectType()
class PupilRegisterPlusManyOutput {
    @Field((_type) => String, { nullable: true })
    email?: string;

    @Field((_type) => Boolean, { nullable: false })
    success: boolean;

    @Field((_type) => String, { nullable: false })
    reason: string;
}

@InputType()
class PupilRegisterPlusManyInput {
    @Field((type) => [PupilRegisterPlusInput])
    entries: PupilRegisterPlusInput[];
}

@InputType()
class PupilUpdateSubjectsInput {
    @Field((type) => [Subject], { nullable: true })
    subjects?: Subject[];
}

export async function updatePupil(
    context: GraphQLContext,
    pupil: Pupil,
    update: PupilUpdateInput,
    prismaInstance: Prisma.TransactionClient | PrismaClient = prisma
) {
    const {
        subjects,
        gradeAsInt,
        projectFields,
        firstname,
        lastname,
        registrationSource,
        email,
        state,
        schooltype,
        languages,
        aboutMe,
        matchReason,
        lastTimeCheckedNotifications,
        notificationPreferences,
    } = update;

    if (projectFields && !pupil.isProjectCoachee) {
        throw new PrerequisiteError(`Only project coachees can set the project fields`);
    }

    if (registrationSource != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`RegistrationSource may only be changed by elevated users`);
    }

    if (email != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`Only Admins may change the email without verification`);
    }

    const res = await prismaInstance.pupil.update({
        data: {
            firstname: ensureNoNull(firstname),
            lastname: ensureNoNull(lastname),
            email: ensureNoNull(email),
            // TODO: Store numbers as numbers maybe ...
            grade: gradeAsInt ? `${gradeAsInt}. Klasse` : undefined,
            subjects: subjects ? JSON.stringify(subjects.map(toPupilSubjectDatabaseFormat)) : undefined,
            projectFields: ensureNoNull(projectFields),
            registrationSource: ensureNoNull(registrationSource),
            state: ensureNoNull(state),
            schooltype: ensureNoNull(schooltype),
            languages: ensureNoNull(languages),
            aboutMe: ensureNoNull(aboutMe),
            lastTimeCheckedNotifications: ensureNoNull(lastTimeCheckedNotifications),
            notificationPreferences: ensureNoNull(notificationPreferences),
            matchReason: ensureNoNull(matchReason),
        },
        where: { id: pupil.id },
    });

    if (pupil.registrationSource !== 'plus' && registrationSource === 'plus') {
        await Notification.actionTaken(userForPupil(pupil), 'pupil_joined_plus', {});
    }

    // The email, firstname or lastname might have changed, so it is a good idea to refresh the session
    await updateSessionUser(context, userForPupil(res));

    logger.info(`Pupil(${pupil.id}) updated their account with ${JSON.stringify(update)}`);
    return res;
}

async function pupilRegisterPlus(data: PupilRegisterPlusInput, ctx: GraphQLContext): Promise<{ success: boolean; reason: string }> {
    let { email } = data;
    const { register, activate } = data;
    try {
        email = validateEmail(email);
        if (register) {
            register.email = validateEmail(register.email);
            if (register.email !== email) {
                throw new PrerequisiteError(`Identifying email is different from email used in registration data`);
            }
        }

        const existingAccount = await prisma.pupil.findUnique({ where: { email } });

        if (!register && !existingAccount) {
            throw new PrerequisiteError(`Account with email ${email} doesn't exist and no registration data was provided`);
        }

        await prisma.$transaction(async (tx) => {
            let pupil = existingAccount;
            if (register) {
                if (pupil) {
                    // if account already exists, overwrite relevant data with new plus data
                    logger.info(`Account with email ${email} already exists, updating account with registration data instead... Pupil(${pupil.id})`);
                    pupil = await updatePupil(ctx, pupil, { ...register, projectFields: undefined }, tx);
                } else {
                    pupil = await registerPupil(register, true, tx);
                    logger.info(`Registered account with email ${email}. Pupil(${pupil.id})`);
                }
            }
            if (activate && pupil?.isPupil) {
                logger.info(`Account with email ${email} is already a tutee, updating pupil with activation data instead... Pupil(${pupil.id})`);
                await updatePupil(ctx, pupil, { ...activate, projectFields: undefined }, tx);
            } else if (activate) {
                await becomeTutee(pupil, activate, tx);
                logger.info(`Made account with email ${email} a tutee. Pupil(${pupil.id})`);
            }
        });
    } catch (e) {
        logger.error(`Error while registering pupil ${email}, skipping this one`, e);
        return { success: false, reason: e.publicMessage || e.toString() };
    }
    return { success: true, reason: '' };
}

@Resolver((of) => GraphQLModel.Pupil)
export class MutatePupilResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.PUPIL, Role.ADMIN)
    async pupilUpdate(@Ctx() context: GraphQLContext, @Arg('data') data: PupilUpdateInput, @Arg('pupilId', { nullable: true }) pupilId?: number) {
        const pupil = await getSessionPupil(context, pupilId);
        await updatePupil(context, pupil, data);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.SCREENER)
    async pupilUpdateSubjects(@Ctx() context: GraphQLContext, @Arg('data') data: PupilUpdateSubjectsInput, @Arg('pupilId') pupilId: number) {
        const pupil = await getPupil(pupilId);
        await updatePupil(context, pupil, { subjects: data.subjects });
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async pupilActivate(@Arg('pupilId') pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await activatePupil(pupil);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async pupilDeactivate(@Arg('pupilId') pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await deactivatePupil(pupil);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TUTEE)
    async pupilCreateMatchRequest(@Ctx() context: GraphQLContext, @Arg('pupilId', { nullable: true }) pupilId?: number): Promise<boolean> {
        const pupil = await getSessionPupil(context, /* elevated override */ pupilId);

        await createPupilMatchRequest(pupil, isElevated(context));

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TUTEE)
    async pupilDeleteMatchRequest(@Ctx() context: GraphQLContext, @Arg('pupilId', { nullable: true }) pupilId?: number): Promise<boolean> {
        const pupil = await getSessionPupil(context, /* elevated override */ pupilId);
        await deletePupilMatchRequest(pupil);

        return true;
    }

    @Mutation((returns) => [PupilRegisterPlusManyOutput])
    @Authorized(Role.ADMIN, Role.SCREENER)
    async pupilRegisterPlusMany(@Ctx() context: GraphQLContext, @Arg('data') data: PupilRegisterPlusManyInput) {
        const { entries } = data;
        logger.info(`Starting pupilRegisterPlusMany, received ${entries.length} pupils`);
        const results = [];
        for (const entry of entries) {
            const res = await pupilRegisterPlus(entry, context);
            results.push({ email: entry.email, ...res });
        }
        logger.info(
            `pupilRegisterPlusMany has finished. Count of successful pupils handled: ${results.filter((p) => p.success).length}. Failed count: ${
                results.filter((p) => p.success).length
            }`
        );
        return results;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async pupilCreateScreening(@Arg('pupilId') pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await addPupilScreening(pupil);

        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async pupilUpdateScreening(
        @Ctx() context: GraphQLContext,
        @Arg('pupilScreeningId') pupilScreeningId: number,
        @Arg('data') data: PupilScreeningUpdateInput
    ): Promise<boolean> {
        const screener = await getSessionScreener(context);
        await updatePupilScreening(screener, pupilScreeningId, data);
        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async pupilMissedScreening(
        @Ctx() context: GraphQLContext,
        @Arg('pupilScreeningId') pupilScreeningId: number,
        @Arg('comment') comment: string
    ): Promise<boolean> {
        const screener = await getSessionScreener(context);
        const { pupil } = await prisma.pupil_screening.findUniqueOrThrow({ where: { id: pupilScreeningId }, include: { pupil: true } });
        await updatePupilScreening(screener, pupilScreeningId, { status: PupilScreeningStatus.pending, comment });
        await Notification.actionTaken(userForPupil(pupil), 'pupil_screening_missed', {});
        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async pupilInvalidateScreening(@Arg('pupilScreeningId') pupilScreeningId?: number): Promise<boolean> {
        await invalidatePupilScreening(pupilScreeningId);
        return true;
    }
}
