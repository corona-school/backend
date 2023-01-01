import { Arg, Authorized, Ctx, Field, InputType, Int, Mutation, ObjectType, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { activatePupil, deactivatePupil } from '../../common/pupil/activation';
import { Role } from '../authorizations';
import { ensureNoNull, getPupil } from '../util';
import * as Notification from '../../common/notification';
import { refreshToken } from '../../common/pupil/token';
import { createPupilMatchRequest, deletePupilMatchRequest } from '../../common/match/request';
import { GraphQLContext } from '../context';
import { getSessionPupil, getSessionScreener, isElevated, updateSessionUser } from '../authentication';
import { Subject } from '../types/subject';
import {
    pupil as Pupil,
    pupil_languages_enum as Language,
    pupil_projectfields_enum as ProjectField,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_schooltype_enum as SchoolType,
    pupil_state_enum as State,
} from '@prisma/client';
import { prisma } from '../../common/prisma';
import { PrerequisiteError } from '../../common/util/error';
import { toPupilSubjectDatabaseFormat } from '../../common/util/subjectsutils';
import { logInContext } from '../logging';
import { userForPupil } from '../../common/user';
import { MaxLength } from 'class-validator';
import { BecomeTuteeInput, RegisterPupilInput } from '../me/mutation';
import { becomeTutee, registerPupil } from '../../common/pupil/registration';

@InputType()
export class PupilUpdateInput {
    @Field((type) => String, { nullable: true })
    firstname?: string;

    @Field((type) => String, { nullable: true })
    lastname?: string;

    @Field((type) => String, { nullable: true })
    email?: string;

    @Field((type) => Int, { nullable: true })
    gradeAsInt?: number;

    @Field((type) => [Subject], { nullable: true })
    subjects?: Subject[];

    @Field((type) => [ProjectField], { nullable: true })
    projectFields: ProjectField[];

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

    @Field((type) => String, { nullable: true })
    @MaxLength(500)
    matchReason?: string;
}

@InputType()
class PupilRegisterPlusInput {
    @Field((type) => RegisterPupilInput, { nullable: true })
    register: RegisterPupilInput;

    @Field((type) => BecomeTuteeInput, { nullable: true })
    activate: BecomeTuteeInput;
}

@ObjectType()
class PupilRegisterPlusManyOutput {
    @Field((_type) => String, { nullable: true })
    email: string;

    @Field((_type) => Boolean, { nullable: false })
    success: boolean;
}

@InputType()
class PupilRegisterPlusManyInput {
    @Field((type) => [PupilRegisterPlusInput], { nullable: true })
    entries: PupilRegisterPlusInput[];
}

export async function updatePupil(context: GraphQLContext, pupil: Pupil, update: PupilUpdateInput) {
    const log = logInContext('Pupil', context);
    const { subjects, gradeAsInt, projectFields, firstname, lastname, registrationSource, email, state, schooltype, languages, aboutMe, matchReason } = update;

    if (projectFields && !pupil.isProjectCoachee) {
        throw new PrerequisiteError(`Only project coachees can set the project fields`);
    }

    if (registrationSource != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`RegistrationSource may only be changed by elevated users`);
    }

    if (email != undefined && !isElevated(context)) {
        throw new PrerequisiteError(`Only Admins may change the email without verification`);
    }

    const res = await prisma.pupil.update({
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
            matchReason: ensureNoNull(matchReason),
        },
        where: { id: pupil.id },
    });

    // The email, firstname or lastname might have changed, so it is a good idea to refresh the session
    await updateSessionUser(context, userForPupil(res));

    log.info(`Pupil(${pupil.id}) updated their account with ${JSON.stringify(update)}`);
}

async function pupilRegisterPlus(data: PupilRegisterPlusInput, ctx: GraphQLContext): Promise<boolean> {
    const log = logInContext('Pupil', ctx);
    const { register, activate } = data;
    const screener = await getSessionScreener(ctx);

    const existingAccount = await prisma.pupil.findUnique({ where: { email: register.email } });
    let doRegister = register != null;
    let doActivate = activate != null;

    if (doRegister && existingAccount) {
        log.info(`Account with email ${register.email} already exists, skipping registration phase`);
        doRegister = false;
    } else if (!register && !existingAccount) {
        throw new PrerequisiteError(`Account with email ${register.email} doesn't exist and no registration data was provided`);
    }

    if (activate && existingAccount?.isPupil) {
        log.info(`Account with email ${register.email} is already active, skipping activation phase`);
        doActivate = false;
    }

    try {
        await prisma.$transaction(async (prisma) => {
            let pupil;
            if (doRegister) {
                pupil = await registerPupil(register);
            } else {
                pupil = existingAccount;
            }

            if (doActivate) {
                await becomeTutee(pupil, activate);
            }
        });
    } catch (e) {
        log.error(`Error while registering pupil ${register.email}, skipping this one`, e);
        return false;
    }
    return true;
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
    @Authorized(Role.ADMIN)
    async pupilActivate(@Arg('pupilId') pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await activatePupil(pupil);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async pupilDeactivate(@Arg('pupilId') pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        await deactivatePupil(pupil);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async pupilResendVerificationMail(@Arg('pupilId') pupilId: number): Promise<boolean> {
        const pupil = await getPupil(pupilId);

        const secretToken = await refreshToken(pupil);
        await Notification.actionTaken(pupil, 'user_authenticate', {
            secretToken,
        });
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
        const results = [];
        for (const entry of entries) {
            const res = await pupilRegisterPlus(entry, context);
            results.push({ email: entry.register.email, success: res });
        }
        return results;
    }
}
