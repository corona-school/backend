import { changeStatus } from "../../common/interest-confirmation/tutoring/persistence/change-status";
import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from "type-graphql";
import { Pupil_tutoring_interest_confirmation_request as TutoringInterestConfirmation } from "../generated";
import { InterestConfirmationStatus } from "../../common/entity/PupilTutoringInterestConfirmationRequest";
import { getManager } from "typeorm";
import { Role } from "../authorizations";

@Resolver(of => TutoringInterestConfirmation)
export class MutateTutoringInterestConfirmationResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async tutoringInterestConfirm(@Arg("token") token: string) {
        await changeStatus(token, InterestConfirmationStatus.CONFIRMED, getManager());
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async tutoringInterestRefuse(@Arg("token") token: string) {
        await changeStatus(token, InterestConfirmationStatus.REFUSED, getManager());
        return true;
    }
}