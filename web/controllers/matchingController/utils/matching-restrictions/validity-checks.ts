import { EntityManager } from "typeorm";
import { personExists } from "../../../../../common/util/person-utils";
import { ApiMatchingRestriction, ApiMatchingRestrictions } from "../../types/matching-restrictions";

/// Checks the given matching restrictions against the database as represented by the given entity manager
export async function ensureValidityOfMatchingRestrictionsAgainstDB(matchingRestrictions: ApiMatchingRestrictions, manager: EntityManager) {
    const allRestrictions: ApiMatchingRestriction[] = [...(matchingRestrictions.tuteeRestrictions ?? []), ...(matchingRestrictions.tutorRestrictions ?? [])];

    //check email restrictions and blocking list restrictions
    const emailsToCheck = allRestrictions.flatMap(r => [...(r.emails ?? []), ...(r.blockingList ?? [])]);
    for (const addr of emailsToCheck) {
        if (!(await personExists(addr, manager))) {
            throw new Error(`Cannot find person with email '${addr}'`);
        }
    }

    //TODO: check for valid subjects

    //everything is fine...
    //returning anything isn't expected...
}

