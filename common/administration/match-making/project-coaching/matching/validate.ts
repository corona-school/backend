import { EntityManager } from "typeorm";
import { Match } from "corona-school-matching";
import { Matching } from "./types";
import { getMatchingPartners } from "../people/matching-partners";
import { Student } from "../../../../entity/Student";
import { Pupil } from "../../../../entity/Pupil";
import { intersection } from "lodash";
import { getProjectMatchByID, ProjectMatch, reloadProjectMatchesInstances } from "../../../../entity/ProjectMatch";

export type ValidationProblem = {
    match: Match;
    problem: string;
};
export type ValidationResult = ValidationProblem | true;


type ValidationCheck = (coach: Student, coachee: Pupil, manager?: EntityManager) => Promise<boolean>;

async function ensureExistence(coach: Student, coachee: Pupil) {
    return !!coach && !!coachee;
}
async function ensureStillActive(coach: Student, coachee: Pupil) {
    return coach.active && coachee.active;
}
async function ensureRoles(coach: Student, coachee: Pupil) {
    return coach.isProjectCoach && coachee.isProjectCoachee;
}
async function ensureOpenMatchRequests(coach: Student, coachee: Pupil) {
    return coach.openProjectMatchRequestCount > 0 && coachee.openProjectMatchRequestCount > 0;
}
async function ensureNeverPreviouslyMatchedTogether(coach: Student, coachee: Pupil, manager: EntityManager) {
    const projectMatchesCoach = await coach.projectMatches;
    const projectMatchesCoachee = await coachee.projectMatches;

    //reload the project match from database, to ensure they really have the pupil and student relationships loaded (they are eager and not always loaded automatically)
    const reloadProjectMatches = async pm => reloadProjectMatchesInstances(pm, manager);

    const partnersCoach = (await reloadProjectMatches(projectMatchesCoach)).map(m => m.pupil.wix_id);
    const partnersCoachee = (await reloadProjectMatches(projectMatchesCoachee)).map(m => m.student.wix_id);

    return intersection([...partnersCoach, ...partnersCoachee], [coach.wix_id, coachee.wix_id]).length === 0;
}
async function ensureScreening(coach: Student, coachee: Pupil) {
    return await coach.hasPermissionToBeProjectCoach();
}
async function ensureOverlappingProjectFields(coach: Student, coachee: Pupil) {
    return (await coachee.overlappingProjectFieldsWithCoach(coach)).length > 0;
}


export async function validateMatch(match: Match, manager: EntityManager): Promise<ValidationResult> {
    const { coach, coachee } = await getMatchingPartners(match, manager);

    const checks: ValidationCheck[] = [
        ensureExistence, //0. make sure that both matching partners really exist
        ensureStillActive, //1. make sure that both matching partners are still active
        ensureRoles, //2. make sure their roles still correspond to project coaching (isProjectCoach, isProjectCoachee)
        ensureOpenMatchRequests, //3. check if both of the matching partners have an open match request
        ensureNeverPreviouslyMatchedTogether, //4. ensure that they weren't previosly matched together
        ensureScreening, //5. ensure that the student/coach is successfully screened
        ensureOverlappingProjectFields //6. make sure that the project fields, including the grade restrictions are overlapping
    ];

    for (const c of checks) {
        if (!await c(coach, coachee, manager)) {
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