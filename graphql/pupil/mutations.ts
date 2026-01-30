import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { activatePupil, deactivatePupil } from '../../common/pupil/activation';
import { Role } from '../authorizations';
import { ensureNoNull, getPupil } from '../util';
import * as Notification from '../../common/notification';
import { createPupilMatchRequest, deletePupilMatchRequest } from '../../common/match/request';
import { GraphQLContext } from '../context';
import { getSessionPupil, getSessionScreener, getSessionUser, isAdmin, isElevated, updateSessionUser } from '../authentication';
import { Subject } from '../types/subject';
import {
    gender_enum as Gender,
    Prisma,
    PrismaClient,
    pupil as Pupil,
    pupil_languages_enum as Language,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_schooltype_enum as SchoolType,
    pupil_screening_status_enum as PupilScreeningStatus,
    pupil_state_enum as State,
    school as School,
} from '@prisma/client';
import { prisma } from '../../common/prisma';
import { PrerequisiteError } from '../../common/util/error';
import { toPupilSubjectDatabaseFormat } from '../../common/util/subjectsutils';
import { DeactivationReason, userForPupil } from '../../common/user';
import { MaxLength } from 'class-validator';
import { NotificationPreferences } from '../types/preferences';
import { addPupilScreening, invalidatePupilScreening, updatePupilScreening } from '../../common/pupil/screening';
import { ValidateEmail } from '../validators';
import { getLogger } from '../../common/logger/logger';
import { RegistrationSchool } from '../types/userInputs';
import moment from 'moment';
import { gradeAsInt, gradeAsString } from '../../common/util/gradestrings';
import { findOrCreateSchool } from '../../common/school/create';
import { CalendarPreferences } from '../types/calendarPreferences';
import redactUsers from '../../common/user/redaction';
import { updateSessionRolesOfUser } from '../../common/user/session';

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

    @Field((type) => Gender, { nullable: true })
    onlyMatchWith?: Gender;

    @Field((type) => Boolean, { nullable: true })
    hasSpecialNeeds?: boolean;

    @Field((type) => String, { nullable: true })
    descriptionForMatch?: string;

    @Field((type) => String, { nullable: true })
    descriptionForScreening?: string;

    @Field((type) => RegistrationSchool, { nullable: true })
    school?: RegistrationSchool;

    @Field((type) => CalendarPreferences, { nullable: true })
    calendarPreferences?: CalendarPreferences;

    @Field((type) => Int, { nullable: true })
    age?: number;

    @Field((type) => Boolean, { nullable: true })
    isPupil?: boolean;

    @Field((type) => Boolean, { nullable: true })
    isParticipant?: boolean;
}

@InputType()
export class PupilScreeningUpdateInput {
    @Field(() => PupilScreeningStatus, { nullable: true })
    status?: PupilScreeningStatus;

    @Field(() => String, { nullable: true })
    comment?: string;

    @Field(() => String, { nullable: true })
    knowsCoronaSchoolFrom?: string;
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
        onlyMatchWith,
        hasSpecialNeeds,
        descriptionForMatch,
        descriptionForScreening,
        school,
        calendarPreferences,
        age,
        isPupil,
        isParticipant,
    } = update;

    if (registrationSource != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`RegistrationSource may only be changed by elevated users`);
    }

    if (email != undefined && !isAdmin(context)) {
        throw new PrerequisiteError(`Only Admins may change the email without verification`);
    }

    if (hasSpecialNeeds != undefined && !isElevated(context)) {
        throw new PrerequisiteError('hasSpecialNeeds may only be changed by elevated users');
    }

    if (onlyMatchWith !== undefined && !isElevated(context)) {
        throw new PrerequisiteError('onlyMatchWith may only be changed by elevated users');
    }

    if (descriptionForMatch !== undefined && !isElevated(context)) {
        throw new PrerequisiteError('descriptionForMatch may only be changed by elevated users');
    }

    if (descriptionForScreening !== undefined && !isElevated(context)) {
        throw new PrerequisiteError('descriptionForScreening may only be changed by elevated users');
    }

    if (isPupil !== undefined && !isElevated(context)) {
        throw new PrerequisiteError('isPupil may only be changed by elevated users');
    }

    if (isParticipant !== undefined && !isElevated(context)) {
        throw new PrerequisiteError('isParticipant may only be changed by elevated users');
    }

    let dbSchool: School | undefined;
    try {
        dbSchool = await findOrCreateSchool(school);
    } catch (error) {
        logger.error('School could not be created', error);
    }

    const res = await prismaInstance.pupil.update({
        data: {
            firstname: ensureNoNull(firstname),
            lastname: ensureNoNull(lastname),
            email: ensureNoNull(email),
            // TODO: Store numbers as numbers maybe ...
            grade: gradeAsInt ? `${gradeAsInt}. Klasse` : undefined,
            subjects: subjects ? JSON.stringify(subjects.map(toPupilSubjectDatabaseFormat)) : undefined,
            registrationSource: ensureNoNull(registrationSource),
            state: ensureNoNull(dbSchool?.state ?? state),
            schooltype: ensureNoNull(dbSchool?.schooltype ?? schooltype),
            languages: ensureNoNull(languages),
            aboutMe: ensureNoNull(aboutMe),
            lastTimeCheckedNotifications: ensureNoNull(lastTimeCheckedNotifications),
            notificationPreferences: ensureNoNull(notificationPreferences),
            matchReason: ensureNoNull(matchReason),
            onlyMatchWith,
            hasSpecialNeeds,
            descriptionForMatch,
            descriptionForScreening,
            schoolId: dbSchool?.id,
            calendarPreferences: ensureNoNull(calendarPreferences as Record<string, any>),
            age: ensureNoNull(age),
            isPupil,
            isParticipant,
        },
        where: { id: pupil.id },
    });

    if (pupil.registrationSource !== 'plus' && registrationSource === 'plus') {
        await Notification.actionTaken(userForPupil(pupil), 'pupil_joined_plus', {});
    }

    // The email, firstname or lastname might have changed, so it is a good idea to refresh the session
    await updateSessionUser(context, userForPupil(res), getSessionUser(context).deviceId);
    // In case screeners change the roles of the user
    if (isParticipant !== pupil.isParticipant || isPupil !== pupil.isPupil) {
        await updateSessionRolesOfUser(userForPupil(res).userID);
    }

    logger.info(`Pupil(${pupil.id}) updated their account with ${JSON.stringify(update)}`);
    return res;
}

@Resolver((of) => GraphQLModel.Pupil)
export class MutatePupilResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER)
    async pupilUpdate(@Ctx() context: GraphQLContext, @Arg('data') data: PupilUpdateInput, @Arg('pupilId', { nullable: true }) pupilId?: number) {
        const pupil = await getSessionPupil(context, pupilId);
        await updatePupil(context, pupil, data);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.PUPIL_SCREENER)
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
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER)
    async pupilDeactivate(@Arg('pupilId') pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await deactivatePupil(pupil, false, DeactivationReason.deactivatedByAdmin, undefined, true);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async pupilRedact(@Arg('pupilId') pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        if (pupil.active) {
            throw new PrerequisiteError('Cannot redact active pupil');
        }
        await redactUsers({ pupils: [pupil], students: [], screener: [] });
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TUTEE, Role.PUPIL_SCREENER)
    async pupilCreateMatchRequest(@Ctx() context: GraphQLContext, @Arg('pupilId', { nullable: true }) pupilId?: number): Promise<boolean> {
        const pupil = await getSessionPupil(context, /* elevated override */ pupilId);

        await createPupilMatchRequest(pupil, isElevated(context));

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TUTEE, Role.PUPIL_SCREENER)
    async pupilDeleteMatchRequest(@Ctx() context: GraphQLContext, @Arg('pupilId', { nullable: true }) pupilId?: number): Promise<boolean> {
        const pupil = await getSessionPupil(context, /* elevated override */ pupilId);
        await deletePupilMatchRequest(pupil);

        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER)
    async pupilCreateScreening(@Arg('pupilId') pupilId: number, @Arg('silent', { nullable: true }) silent?: boolean): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await addPupilScreening(pupil, undefined, silent ?? false);

        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER)
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
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER)
    async pupilMissedScreening(
        @Ctx() context: GraphQLContext,
        @Arg('pupilScreeningId') pupilScreeningId: number,
        @Arg('comment') comment: string
    ): Promise<boolean> {
        const screener = await getSessionScreener(context);
        const { pupil, pupilId } = await prisma.pupil_screening.findUniqueOrThrow({ where: { id: pupilScreeningId }, include: { pupil: true } });
        await updatePupilScreening(screener, pupilScreeningId, { status: PupilScreeningStatus.pending, comment });
        const validScreeningCount = await prisma.pupil_screening.count({ where: { pupilId } });
        const asUser = userForPupil(pupil);
        const isFirstScreening = validScreeningCount === 1;
        if (isFirstScreening) {
            await Notification.actionTaken(asUser, 'pupil_screening_after_registration_missed', {});
        } else {
            await Notification.actionTaken(asUser, 'pupil_screening_missed', {});
        }
        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER)
    async pupilInvalidateScreening(@Arg('pupilScreeningId') pupilScreeningId?: number): Promise<boolean> {
        await invalidatePupilScreening(pupilScreeningId);
        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN)
    async adminIncreasePupilGrades() {
        const grades = Array.from({ length: 12 }, (_, i) => gradeAsString(i + 1)).reverse();
        for (const grade of grades) {
            try {
                const nextGrade = gradeAsString(gradeAsInt(grade) + 1);
                const query = {
                    grade,
                    active: true,
                    OR: [{ gradeUpdatedAt: { lt: moment().subtract(10, 'months').toDate() } }, { gradeUpdatedAt: { equals: null } }],
                };
                const pupils = await prisma.pupil.findMany({ where: query });
                await prisma.pupil.updateMany({
                    where: query,
                    data: {
                        grade: nextGrade,
                        gradeUpdatedAt: new Date(),
                    },
                });
                await Notification.bulkActionTaken(
                    pupils.map((pupil) => userForPupil(pupil)),
                    'pupil_grade_increased',
                    { uniqueId: `pupil_grade_increased_${new Date().toISOString()}` }
                );
                logger.info(`Successfully increased the grade of ${pupils.length} pupils from ${grade} to ${nextGrade}`);
            } catch (error) {
                logger.info(`Attempting to increase the grade of pupils from ${grade}`, error);
            }
        }
        return true;
    }
}
