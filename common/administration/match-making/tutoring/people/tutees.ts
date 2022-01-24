import { EntityManager, SelectQueryBuilder } from "typeorm";
import { RegistrationSource } from "../../../../entity/Person";
import { Pupil } from "../../../../entity/Pupil";
import { InterestConfirmationStatus } from "../../../../entity/PupilTutoringInterestConfirmationRequest";
import { InvalidEmailDomains } from "../../invalid-email-domains";

///Returns true whether the tutee is allowed to get a match (this does not respect interest-confirmation, since that isn't such an important criteria and more acts like a filter for _qualified_ matches)
export async function tuteeIsAllowedToGetMatch(manager: EntityManager, tutee: Pupil) {
    //basic criteria every tutee that want's a match, must fulfill
    return tutee.active && tutee.verification == null && tutee.isPupil && tutee.openMatchRequestCount > 0;
}
/// Returns all *matchableTutees* all, i.e. all who are allowed to get a match in theory, without any further match-quality restrictions like interest-confirmations
/// (interest-confirmation is only a restriction with respect to match quality, because everyone that registered as "matchable" originally wanted a match and applies to get a match)
export function matchableTuteesQuery(manager: EntityManager): SelectQueryBuilder<Pupil> {
    return manager.createQueryBuilder()
        .select("p")
        .from(Pupil, "p")
        .where("p.active IS TRUE \
                AND p.verification IS NULL \
                AND p.isPupil IS TRUE \
                AND p.openMatchRequestCount > 0 \
                AND p.subjects <> '[]' \
                AND split_part(p.email, '@', 2) NOT IN (:...emailDomainExclusions) \
                AND p.registrationSource <> '4'", { emailDomainExclusions: InvalidEmailDomains});
}

/// The second parameter indicates whether the tutees to match should include only those with confirmed interest (via an interest-confirmation request or via partner schools) or any matchable tutee
export function tuteesToMatchQuery(manager: EntityManager, restrictToThoseWithConfirmedInterest: boolean): SelectQueryBuilder<Pupil> {
    let q = matchableTuteesQuery(manager);

    if (restrictToThoseWithConfirmedInterest) {
        q = q.leftJoinAndSelect("p.tutoringInterestConfirmationRequest", "pticr")
            .andWhere("(p.registrationSource = (:rs) OR pticr.status = (:cs))", { rs: RegistrationSource.COOPERATION, cs: InterestConfirmationStatus.CONFIRMED });
    }

    return q;
}

export async function getNumberOfTuteesToMatch(manager: EntityManager, restrictToThoseWithConfirmedInterest: boolean) {
    return await tuteesToMatchQuery(manager, restrictToThoseWithConfirmedInterest).getCount();
}
/// Return all tutees that should be matched when this function is called
// (it contains all matchable tutees filtered by those who are coming from a partner school or have explicitly confirmed their interest -> this way, we wanna achieve a higher match quality)
export async function tuteesToMatch(manager: EntityManager, restrictToThoseWithConfirmedInterest: boolean) {
    return await tuteesToMatchQuery(manager, restrictToThoseWithConfirmedInterest).getMany();
}