import { Helper, SubjectWithGradeRestriction } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { reloadProjectMatchesInstances } from "../../../../../entity/ProjectMatch";
import { Student, DEFAULT_PROJECT_COACH_GRADERESTRICTIONS } from "../../../../../entity/Student";
import { ProjectFieldWithGradeInfoType } from "../../../../../jufo/projectFieldWithGradeInfoType";
import { transformPersonToPersonID } from "./persons";

function projectFieldToSubject(projectField: ProjectFieldWithGradeInfoType): SubjectWithGradeRestriction {
    return {
        name: projectField.name,
        gradeRestriction: {
            min: projectField.min ?? DEFAULT_PROJECT_COACH_GRADERESTRICTIONS.MIN, //use default values, because due to a screening tool's bug (or how it is designed), those values may be null (which causes the algorithm to fail)
            max: projectField.max ?? DEFAULT_PROJECT_COACH_GRADERESTRICTIONS.MAX
        }
    };
}
export async function transformCoachToHelper(coach: Student, manager: EntityManager): Promise<Helper> {
    //reloading the project matches instances is required, cause we're accessing the student property of those matches below, and we cannot ensure that the coachee really has a student property without proper loading of the _eager_ ProjecMatch entity!
    const existingMatches = await reloadProjectMatchesInstances(await coach.projectMatches, manager);
    const projectFields = (await coach.getProjectFields());

    return {
        id: coach.id,
        uuid: coach.wix_id,
        createdAt: coach.createdAt,
        state: coach.state,
        excludeMatchesWith: existingMatches.map(m => transformPersonToPersonID(m.pupil)),
        matchRequestCount: coach.openProjectMatchRequestCount,
        subjects: projectFields.map(projectFieldToSubject)
    };
}
export async function transformCoachesToHelpers(coaches: Student[], manager: EntityManager): Promise<Helper[]> {
    return Promise.all(coaches.map(c => transformCoachToHelper(c, manager)));
}