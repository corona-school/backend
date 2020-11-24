import { Pupil } from "../../../../entity/Pupil";
import { Student } from "../../../../entity/Student";
import { match as computeMatching } from "corona-school-matching";
import { transformCoachesToHelpers } from "./transforms/coaches";
import { transformCoacheesToHelpees } from "./transforms/coachees";
import { Matching } from "./types";
import { EntityManager } from "typeorm";

export async function createMatching(coaches: Student[], coachees: Pupil[], manager: EntityManager): Promise<Matching> {
    const helpers = await transformCoachesToHelpers(coaches, manager);
    const helpees = await transformCoacheesToHelpees(coachees, manager);

    const { matches } = computeMatching(helpers, helpees);

    return matches;
}