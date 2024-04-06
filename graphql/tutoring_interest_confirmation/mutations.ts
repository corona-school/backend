import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from 'type-graphql';
import { Pupil_tutoring_interest_confirmation_request as TutoringInterestConfirmation } from '../generated';
import { Role } from '../authorizations';
import { getPupil } from '../util';
import { prisma } from '../../common/prisma';
import { logTransaction } from '../../common/transactionlog/log';
import { RedundantError } from '../../common/util/error';
import { UserInputError } from '../error';
import { InterestConfirmationStatus, requestInterestConfirmation } from '../../common/match/interest';
import { getLogger } from '../../common/logger/logger';
import { v4 as uuid } from 'uuid';
import { userForPupil } from '../../common/user';

const logger = getLogger('MutateTutoringInterest');

async function changeStatus(token: string, status: InterestConfirmationStatus) {
    const confirmation = await prisma.pupil_tutoring_interest_confirmation_request.findUnique({
        where: {
            token,
        },
    });

    if (!confirmation) {
        throw new UserInputError(`Invalid token '${token}'`);
    }

    if (confirmation.status !== InterestConfirmationStatus.PENDING) {
        throw new RedundantError(`Already confirmed interest`);
    }

    await prisma.pupil_tutoring_interest_confirmation_request.update({
        data: { status },
        where: { token },
    });

    const pupil = await getPupil(confirmation.pupilId);
    await logTransaction('pupilInterestConfirmationRequestStatusChange', userForPupil(pupil), {
        changeDate: Date.now(),
        previousStatus: InterestConfirmationStatus.PENDING,
        newStatus: status,
    });
}
@Resolver((of) => TutoringInterestConfirmation)
export class MutateTutoringInterestConfirmationResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    async tutoringInterestConfirm(@Arg('token') token: string) {
        await changeStatus(token, InterestConfirmationStatus.CONFIRMED);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    async tutoringInterestRefuse(@Arg('token') token: string) {
        await changeStatus(token, InterestConfirmationStatus.REFUSED);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async tutoringInterestCreate(@Arg('pupilId') pupilId: number, @Arg('status') status: InterestConfirmationStatus) {
        const pupil = await getPupil(pupilId);
        const existing = await prisma.pupil_tutoring_interest_confirmation_request.findFirst({
            where: { pupilId, invalidated: false },
        });

        if (existing) {
            await changeStatus(existing.token, status);
            return true;
        }

        await prisma.pupil_tutoring_interest_confirmation_request.create({
            data: { token: uuid(), pupilId, status, invalidated: false },
        });

        void logTransaction('pupilInterestConfirmationRequestStatusChange', userForPupil(pupil), {
            changeDate: Date.now(),
            previousStatus: InterestConfirmationStatus.PENDING,
            newStatus: status,
        });

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async tutoringInterestRequest(@Arg('pupilId') pupilId: number) {
        const pupil = await getPupil(pupilId);
        await requestInterestConfirmation(pupil);

        logger.info(`Admin requested interest of Pupil(${pupilId})`);

        return true;
    }
}
