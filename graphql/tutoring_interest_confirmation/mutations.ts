import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from "type-graphql";
import { Pupil_tutoring_interest_confirmation_request as TutoringInterestConfirmation } from "../generated";
import { InterestConfirmationStatus } from "../../common/entity/PupilTutoringInterestConfirmationRequest";
import { Role } from "../authorizations";
import { getPupil } from "../util";
import { prisma } from "../../common/prisma";
import { logTransaction } from "../../common/transactionlog/log";
import { RedundantError } from "../../common/util/error";
import { UserInputError } from "../error";
import { generateToken } from "../../jobs/periodic/fetch/utils/verification";

async function changeStatus(token: string, status: InterestConfirmationStatus) {
    const confirmation = await prisma.pupil_tutoring_interest_confirmation_request.findUnique({
        where: {
            token
        }
    });

    if (!confirmation) {
        throw new UserInputError(`Invalid token '${token}'`);
    }

    if (confirmation.status !== InterestConfirmationStatus.PENDING) {
        throw new RedundantError(`Already confirmed interest`);
    }

    await prisma.pupil_tutoring_interest_confirmation_request.update({
        data: { status },
        where: { token }
    });

    const pupil = await getPupil(confirmation.pupilId);
    logTransaction("pupilInterestConfirmationRequestStatusChange", pupil, {
        changeDate: Date.now(),
        previousStatus: InterestConfirmationStatus.PENDING,
        newStatus: status
    });
}
@Resolver(of => TutoringInterestConfirmation)
export class MutateTutoringInterestConfirmationResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    async tutoringInterestConfirm(@Arg("token") token: string) {
        await changeStatus(token, InterestConfirmationStatus.CONFIRMED);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    async tutoringInterestRefuse(@Arg("token") token: string) {
        await changeStatus(token, InterestConfirmationStatus.REFUSED);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async tutoringInterestCreate(@Arg("pupilId") pupilId: number, @Arg("status") status: InterestConfirmationStatus) {
        const pupil = await getPupil(pupilId);
        const existing = await prisma.pupil_tutoring_interest_confirmation_request.findFirst({
            where: { pupilId }
        });

        if (existing) {
            await changeStatus(existing.token, status);
            return true;
        }

        await prisma.pupil_tutoring_interest_confirmation_request.create({
            data: { token: generateToken(), pupilId, status }
        });

        logTransaction("pupilInterestConfirmationRequestStatusChange", pupil, {
            changeDate: Date.now(),
            previousStatus: InterestConfirmationStatus.PENDING,
            newStatus: status
        });
    }
}