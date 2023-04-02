import { Helpee } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { reloadMatchesInstances } from "../../../../../entity/Match";
import { Pupil } from "../../../../../entity/Pupil";
import { transformPersonToPersonID } from "./persons";

export async function transformTuteeToHelpee(tutee: Pupil, manager: EntityManager): Promise<Helpee> {
    //reloading the matches instances is required, cause we're accessing the student property of those matches below, and we cannot ensure that the tutee really has a student property without proper loading of the _eager_ Match entity!
    const existingMatches = await reloadMatchesInstances(await tutee.matches, manager);

    return {
        id: tutee.id,
        uuid: tutee.wix_id,
        createdAt: tutee.createdAt,
        state: tutee.state,
        excludeMatchesWith: existingMatches.map(m => transformPersonToPersonID(m.student)),
        matchRequestCount: tutee.openMatchRequestCount,
        subjects: tutee.getSubjectsFormatted(),
        grade: tutee.gradeAsNumber(),
        matchingPriority: tutee.matchingPriority
    };
}
export function transformTuteesToHelpees(tutees: Pupil[], manager: EntityManager): Promise<Helpee[]> {
    return Promise.all(tutees.map(c => transformTuteeToHelpee(c, manager)));
}
