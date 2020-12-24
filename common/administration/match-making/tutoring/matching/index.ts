import { Pupil } from "../../../../entity/Pupil";
import { Student } from "../../../../entity/Student";
import { match as computeMatching } from "corona-school-matching";
import { transformTutorsToHelpers } from "./transforms/tutors";
import { transformTuteesToHelpees } from "./transforms/tutees";
import { Matching } from "./types";
import { EntityManager } from "typeorm";

export async function createMatching(tutors: Student[], tutees: Pupil[], manager: EntityManager): Promise<Matching> {
    const helpers = await transformTutorsToHelpers(tutors, manager);
    const helpees = await transformTuteesToHelpees(tutees, manager);

    const { matches } = computeMatching(helpers, helpees);

    return matches;
}