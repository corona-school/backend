import { Helper, SubjectWithGradeRestriction } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { reloadMatchesInstances } from "../../../../../entity/Match";
import { Student, Subject, DEFAULT_TUTORING_GRADERESTRICTIONS } from "../../../../../entity/Student";
import { transformPersonToPersonID } from "./persons";

function formattedSubjectToSubjectWithGradeRestriction(subject: Subject): SubjectWithGradeRestriction {
    return {
        name: subject.name,
        gradeRestriction: {
            min: subject.grade?.min ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MIN, //use default values, because due to a screening tool's bug (or how it is designed), those values may be null (which causes the algorithm to fail)
            max: subject.grade?.max ?? DEFAULT_TUTORING_GRADERESTRICTIONS.MAX
        }
    };
}
export async function transformTutorToHelper(tutor: Student, manager: EntityManager): Promise<Helper> {
    //reloading the matches instances is required, cause we're accessing the student property of those matches below, and we cannot ensure that the tutee really has a pupil property without proper loading of the _eager_ Match entity!
    const existingMatches = await reloadMatchesInstances(await tutor.matches, manager);

    return {
        id: tutor.id,
        uuid: tutor.wix_id,
        createdAt: tutor.createdAt,
        state: tutor.state,
        excludeMatchesWith: existingMatches.map(m => transformPersonToPersonID(m.pupil)),
        matchRequestCount: tutor.openMatchRequestCount,
        subjects: tutor.getSubjectsFormatted().map(formattedSubjectToSubjectWithGradeRestriction)
    };
}
export async function transformTutorsToHelpers(tutors: Student[], manager: EntityManager): Promise<Helper[]> {
    return Promise.all(tutors.map(c => transformTutorToHelper(c, manager)));
}