import { EntityManager } from "typeorm";
import { InterestConfirmationStatus } from "../../../../entity/PupilTutoringInterestConfirmationRequest";
import { allMatchablePupilsUnremindedWithPendingConfirmation, allMatchablePupilsWithoutInterestConfirmationRequestLimitedQuery, allMatchablePupilsWithRequestConfirmationStatusLimitedQuery, createFilterPupilRequestByStatusQueryFrom, createOrderedAndLimitedPupilsQueryFrom } from "./db-queries";
import * as moment from "moment-timezone";


/// Return all pupils which are matchable, have received the interest-confirmation request and which is in the given status.
async function getAllMatchablePupilsWithRequestConfirmationStatus(manager: EntityManager, status: InterestConfirmationStatus, limitToN?: number) {
    return await allMatchablePupilsWithRequestConfirmationStatusLimitedQuery(manager, status, limitToN).getMany();
}
/// All matchable pupils that have confirmed their interest, but only take the first n, ordered by registration date, if given.
export async function getAllMatchablePupilsWithConfirmedInterest(manager: EntityManager, limitToN?: number) {
    return getAllMatchablePupilsWithRequestConfirmationStatus(manager, InterestConfirmationStatus.CONFIRMED, limitToN);
}
export async function numberOfMatchablePupilsWithConfirmedInterest(manager: EntityManager) {
    return (await getAllMatchablePupilsWithConfirmedInterest(manager)).length;
}

/// All matchable pupils that haven't so far received the interest-confirmation mail, but only take the first n, ordered by registration date, if given
export async function getAllMatchablePupilsWithoutInterestConfirmationRequest(manager: EntityManager, limitToN?: number) {
    return await allMatchablePupilsWithoutInterestConfirmationRequestLimitedQuery(manager, limitToN).getMany();
}

/// All matchable pupils that have received the first interest-confirmation request, which they haven't answered on so far – but they weren't reminded until now.
export async function getAllMatchableUnremindedPupilsWithPendingConfirmationRequest(manager: EntityManager, ndaysAfterInitialSend: number) {
    const allPendingUnreminded = await allMatchablePupilsUnremindedWithPendingConfirmation(manager).getMany();

    //filter by dates after initial sending
    return allPendingUnreminded.filter( p => {
        return moment(p.tutoringInterestConfirmationRequest.createdAt).add(ndaysAfterInitialSend, "days").startOf("day").isBefore(moment());
    });
}