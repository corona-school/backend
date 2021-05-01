import { EntityManager } from "typeorm";
import { Matching, Match } from "./types";
import { getMatchingPartners } from "../people/matching-partners";
import { Student } from "../../../../entity/Student";
import { Pupil } from "../../../../entity/Pupil";
import { intersection } from "lodash";
import { tutorIsAllowedToGetMatch } from "../people/tutors";
import { tuteeIsAllowedToGetMatch } from "../people/tutees";
import { reloadMatchesInstances } from "../../../../entity/Match";

export type ValidationProblem = {
    match: Match;
    problem: string;
};
export type ValidationResult = ValidationProblem | true;


type ValidationCheck = (tutor: Student, tutee: Pupil, manager?: EntityManager) => Promise<boolean>;

async function ensureExistence(tutor: Student, tutee: Pupil) {
    return !!tutor && !!tutee;
}
async function ensureStillActive(tutor: Student, tutee: Pupil) {
    return tutor.active && tutee.active;
}
async function ensureRoles(tutor: Student, tutee: Pupil) {
    return tutor.isStudent && tutee.isPupil;
}
async function ensureOpenMatchRequests(tutor: Student, tutee: Pupil) {
    return tutor.openMatchRequestCount > 0 && tutee.openMatchRequestCount > 0;
}
async function ensureNeverPreviouslyMatchedTogether(tutor: Student, tutee: Pupil, manager: EntityManager) {
    const matchesTutor = await tutor.matches;
    const matchesTutee = await tutee.matches;

    //reload the match from database, to ensure they really have the pupil and student relationships loaded (they are eager and not always loaded automatically)
    const reloadMatches = async m => reloadMatchesInstances(m, manager);

    const partnersTutor = (await reloadMatches(matchesTutor)).map(m => m.pupil.wix_id);
    const partnersTutee = (await reloadMatches(matchesTutee)).map(m => m.student.wix_id);

    return intersection([...partnersTutor, ...partnersTutee], [tutor.wix_id, tutee.wix_id]).length === 0;
}
async function ensureScreening(tutor: Student, tutee: Pupil, manager: EntityManager) {
    return await tutorIsAllowedToGetMatch(manager, tutor);
}
async function ensureNeed(tutor: Student, tutee: Pupil, manager: EntityManager) {
    return await tuteeIsAllowedToGetMatch(manager, tutee);
}
async function ensureOverlappingSubjects(tutor: Student, tutee: Pupil) {
    return (await tutee.overlappingSubjectsWithTutor(tutor)).length > 0;
}


export async function validateMatch(match: Match, manager: EntityManager): Promise<ValidationResult> {
    const { tutor, tutee } = await getMatchingPartners(match, manager);

    const checks: ValidationCheck[] = [
        ensureExistence, //0. make sure that both matching partners really exist
        ensureStillActive, //1. make sure that both matching partners are still active
        ensureRoles, //2. make sure their roles still correspond to tutoring (isStudent, isPupil)
        ensureOpenMatchRequests, //3. check if both of the matching partners have an open match request
        ensureNeverPreviouslyMatchedTogether, //4. ensure that they weren't previously matched together
        ensureScreening, //5. ensure that the student/tutor is successfully screened
        ensureOverlappingSubjects, //6. make sure that the subjects, including the grade restrictions are overlapping
        ensureNeed //7. make sure the tutee really needs the match...
    ];

    for (const c of checks) {
        if (!await c(tutor, tutee, manager)) {
            return {
                match: match,
                problem: `Check ${c.name} failed!`
            };
        }
    }

    return true;
}

export async function validateMatching(matching: Matching, manager: EntityManager): Promise<ValidationResult> {
    for (const m of matching) {
        const validationResult = await validateMatch(m, manager);

        if (validationResult !== true) {
            return validationResult;
        }
    }
    return true;
}