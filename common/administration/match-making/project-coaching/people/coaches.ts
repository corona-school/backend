import { EntityManager, SelectQueryBuilder } from "typeorm";
import { ScreeningStatus, Student } from "../../../../entity/Student";
import { TutorJufoParticipationIndication } from "../../../../jufo/participationIndication";

///Returns true whether the project coach is allowed to get a project match
export async function coachIsAllowedToGetProjectMatch(manager: EntityManager, coach: Student) {
    //basic criteria every coach that want's a match, must fulfill
    const isAllowedBasics = coach.active && coach.verification == null && coach.isProjectCoach && coach.openProjectMatchRequestCount > 0;

    //1-on-1 tutor criterion
    const isAllowedBy1on1Tutoring = coach.isStudent && await coach.screeningStatus() === ScreeningStatus.Accepted;

    //project coaching criterion
    const needsOfficialConfirmationFromJufo = coach.isStudent === false && coach.isUniversityStudent === false && coach.wasJufoParticipant === TutorJufoParticipationIndication.YES && coach.hasJufoCertificate === false;
    const isAllowedByProjectCoaching = await coach.projectCoachingScreeningStatus() === ScreeningStatus.Accepted && (coach.jufoPastParticipationConfirmed || !needsOfficialConfirmationFromJufo);

    //being 1-on-1 tutor is sufficient, otherwise the project coaching criteria is selected
    return isAllowedBasics && (isAllowedBy1on1Tutoring || isAllowedByProjectCoaching);
}
export function coachesToMatchQuery(manager: EntityManager): SelectQueryBuilder<Student> {
    //NOTE: also those who are screened successful as a tutor will be allowed to get project coaching matches
    return manager.createQueryBuilder()
        .select("s")
        .from(Student, "s")
        .leftJoin("s.projectCoachingScreening", "projectCoachingScreening")
        .leftJoin("s.screening", "screening")
        .where("s.active IS TRUE \
                AND s.verification IS NULL \
                AND s.isProjectCoach IS TRUE \
                AND s.openProjectMatchRequestCount > 0 \
                AND ( \
                    ( projectCoachingScreening.success IS TRUE AND (s.wasJufoParticipant <> 'yes' OR s.hasJufoCertificate IS TRUE OR s.jufoPastParticipationConfirmed IS TRUE OR s.isUniversityStudent IS TRUE) ) \
                    OR (screening.success IS TRUE AND s.isStudent) \
                    )");
    //NOTE (and probably TODO): if someone has invalid column combinations (that shouldn't be allowed by registration and the general model), those are not caught at the moment. E.g. if s.wasJufoParticipant = NULL AND projectCoachingScreening.success = TRUE, this one could falsely get into the matching even if he's not a university Student.
}

export async function getNumberOfCoachesToMatch(manager: EntityManager) {
    return await coachesToMatchQuery(manager).getCount();
}
export async function coachesToMatch(manager: EntityManager) {
    return await coachesToMatchQuery(manager).getMany();
}