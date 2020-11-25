import { EntityManager, SelectQueryBuilder } from "typeorm";
import { Pupil } from "../../../../entity/Pupil";

///Returns true whether the project coachee is allowed to get a project match
export async function coacheeIsAllowedToGetProjectMatch(manager: EntityManager, coachee: Pupil) {
    //basic criteria every coachee that want's a match, must fulfill
    return coachee.active && coachee.verification == null && coachee.isProjectCoachee && coachee.openProjectMatchRequestCount > 0;
}
export function coacheesToMatchQuery(manager: EntityManager): SelectQueryBuilder<Pupil> {
    return manager.createQueryBuilder()
        .select("p")
        .from(Pupil, "p")
        .where("p.active IS TRUE AND p.verification IS NULL AND p.isProjectCoachee IS TRUE AND p.openProjectMatchRequestCount > 0 AND p.projectFields <> '{}'");
}

export async function getNumberOfCoacheesToMatch(manager: EntityManager) {
    return await coacheesToMatchQuery(manager).getCount();
}
export async function coacheesToMatch(manager: EntityManager) {
    return await coacheesToMatchQuery(manager).getMany();
}