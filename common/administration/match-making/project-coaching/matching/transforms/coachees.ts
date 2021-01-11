import { Helpee, Subject } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { reloadProjectMatchesInstances } from "../../../../../entity/ProjectMatch";
import { Pupil } from "../../../../../entity/Pupil";
import { ProjectField } from "../../../../../jufo/projectFields";
import { transformPersonToPersonID } from "./persons";

function projectFieldToSubject(projectField: ProjectField): Subject {
    return {
        name: projectField
    };
}
export async function transformCoacheeToHelper(coachee: Pupil, manager: EntityManager): Promise<Helpee> {
    //reloading the project matches instances is required, cause we're accessing the student property of those matches below, and we cannot ensure that the coachee really has a student property without proper loading of the _eager_ ProjecMatch entity!
    const existingMatches = await reloadProjectMatchesInstances(await coachee.projectMatches, manager);

    return {
        id: coachee.id,
        uuid: coachee.wix_id,
        createdAt: coachee.createdAt,
        state: coachee.state,
        excludeMatchesWith: existingMatches.map(m => transformPersonToPersonID(m.student)),
        matchRequestCount: coachee.openProjectMatchRequestCount,
        subjects: coachee.projectFields.map(projectFieldToSubject),
        grade: coachee.assumedProjectCoachingMatchingGrade(),
        matchingPriority: 0 //consistent for project coaching matching, for now
    };
}
export async function transformCoacheesToHelpees(coachees: Pupil[], manager: EntityManager): Promise<Helpee[]> {
    return Promise.all(coachees.map(c => transformCoacheeToHelper(c, manager)));
}