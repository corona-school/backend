import { Resolver, Mutation, Root, Arg, Authorized, Ctx, InputType, Field, Int } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { activatePupil, deactivatePupil } from '../../common/pupil/activation';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { ensureNoNull, getPupil } from '../util';
import * as Notification from '../../common/notification';
import { refreshToken } from '../../common/pupil/token';
import { createPupilMatchRequest, deletePupilMatchRequest } from '../../common/match/request';
import { GraphQLContext } from '../context';
import { getSessionPupil, isElevated, updateSessionUser } from '../authentication';
import { Subject } from '../types/subject';
import {
    pupil as Pupil,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_projectfields_enum as ProjectField,
    pupil_state_enum as State,
    pupil_schooltype_enum as SchoolType,
} from '@prisma/client';
import { prisma } from '../../common/prisma';
import { PrerequisiteError } from '../../common/util/error';
import { toPupilSubjectDatabaseFormat } from '../../common/util/subjectsutils';
import { logInContext } from '../logging';
import { userForPupil } from '../../common/user';

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
}

export async function updatePupil(context: GraphQLContext, pupil: Pupil, update: PupilUpdateInput) {
    const log = logInContext('Pupil', context);
    const { subjects, gradeAsInt, projectFields, firstname, lastname, registrationSource, email, state, schooltype } = update;

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
        },
        where: { id: pupil.id },
    });
    await updateSessionUser(context, userForPupil(res));

    log.info(`Pupil(${pupil.id}) updated their account with ${JSON.stringify(update)}`);
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
}
