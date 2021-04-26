import { EntityManager, SelectQueryBuilder } from "typeorm";
import { matchableTuteesQuery } from "../../../../administration/match-making/tutoring/people/tutees";
import { RegistrationSource } from "../../../../entity/Person";
import { Pupil } from "../../../../entity/Pupil";
import { InterestConfirmationStatus } from "../../../../entity/PupilTutoringInterestConfirmationRequest";

// Raw Queries:
// ⎺⎺⎺⎺⎺⎺⎺⎺
function allMatchablePupilsThatRequireInterestConfirmationQuery(manager: EntityManager) {
    //only pupils not registered through partner schools require interest confirmation
    return matchableTuteesQuery(manager).andWhere("p.registrationSource != (:rs)", { rs: RegistrationSource.COOPERATION});
}
function allMatchablePupilsWithoutInterestConfirmationRequestQuery(manager: EntityManager) {
    //join pupil p2 a second time, to have a relationship from PupilTutoringInterestConfirmationRequest to Pupil which is not undefined
    return allMatchablePupilsThatRequireInterestConfirmationQuery(manager).leftJoinAndSelect("p.tutoringInterestConfirmationRequest", "pticr").leftJoinAndSelect("pticr.pupil", "p2").andWhere("pticr IS NULL");
}
function allMatchablePupilsWithInterestConfirmationRequestQuery(manager: EntityManager) {
    return allMatchablePupilsThatRequireInterestConfirmationQuery(manager).innerJoinAndSelect("p.tutoringInterestConfirmationRequest", "pticr").leftJoinAndSelect("pticr.pupil", "p2");
}


// Combinable Query-Extensions:
// ⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺
export function createOrderedAndLimitedPupilsQueryFrom(qb: SelectQueryBuilder<Pupil>, limitToN?: number) {
    const q = qb.addOrderBy("p.createdAt", "ASC");
    if (limitToN) return q.take(limitToN);
    return q;
}
export function createFilterPupilRequestByStatusQueryFrom(qb: SelectQueryBuilder<Pupil>, status: InterestConfirmationStatus) {
    return qb.andWhere("pticr.status = :status", { status });
}
export function createUnremindedPupilRequestQueryFrom(qb: SelectQueryBuilder<Pupil>) {
    return qb.andWhere("pticr.reminderSentDate IS NULL");
}

// Combined Queries
// ⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺
/// Return all pupils which are matchable, have received the interest-confirmation request and which is in the given status.
export function allMatchablePupilsWithRequestConfirmationStatusLimitedQuery(manager: EntityManager, status: InterestConfirmationStatus, limitToN?: number) {
    const pupilsWithConfirmationRequest = allMatchablePupilsWithInterestConfirmationRequestQuery(manager);
    const filteredPupilsWithConfirmationRequest = createFilterPupilRequestByStatusQueryFrom(pupilsWithConfirmationRequest, status);
    const orderedLimitedPendingPupilsWithConfirmationRequest = createOrderedAndLimitedPupilsQueryFrom(filteredPupilsWithConfirmationRequest, limitToN);

    return orderedLimitedPendingPupilsWithConfirmationRequest;
}

export function allMatchablePupilsWithoutInterestConfirmationRequestLimitedQuery(manager: EntityManager, limitToN?: number) {
    return createOrderedAndLimitedPupilsQueryFrom(allMatchablePupilsWithoutInterestConfirmationRequestQuery(manager), limitToN);
}

export function allMatchablePupilsUnremindedWithPendingConfirmation(manager: EntityManager) {
    const allPendingQuery = allMatchablePupilsWithRequestConfirmationStatusLimitedQuery(manager, InterestConfirmationStatus.PENDING);
    const allUnremindedQuery = createUnremindedPupilRequestQueryFrom(allPendingQuery);

    return allUnremindedQuery;
}