import { EntityManager, SelectQueryBuilder } from "typeorm";
import { Pupil } from "../../../../entity/Pupil";
import { InvalidEmailDomains } from "../../invalid-email-domains";

///Returns true whether the tutee is allowed to get a match
export async function tuteeIsAllowedToGetMatch(manager: EntityManager, tutee: Pupil) {
    //basic criteria every tutee that want's a match, must fulfill
    return tutee.active && tutee.verification == null && tutee.isPupil && tutee.openMatchRequestCount > 0;
}
export function tuteesToMatchQuery(manager: EntityManager): SelectQueryBuilder<Pupil> {
    return manager.createQueryBuilder()
        .select("p")
        .from(Pupil, "p")
        .where("p.active IS TRUE \
                AND p.verification IS NULL \
                AND p.isPupil IS TRUE \
                AND p.openMatchRequestCount > 0 \
                AND p.subjects <> '[]' \
                AND split_part(p.email, '@', 2) NOT IN (:...emailDomainExclusions)", { emailDomainExclusions: InvalidEmailDomains});
}

export async function getNumberOfTuteesToMatch(manager: EntityManager) {
    return await tuteesToMatchQuery(manager).getCount();
}
export async function tuteesToMatch(manager: EntityManager) {
    return await tuteesToMatchQuery(manager).getMany();
}