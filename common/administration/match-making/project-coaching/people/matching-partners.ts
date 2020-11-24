import { Match as AlgoMatch } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { getPupilByWixID, Pupil } from "../../../../entity/Pupil";
import { getStudentByWixID, Student } from "../../../../entity/Student";

export async function getMatchingPartners(match: AlgoMatch, manager: EntityManager): Promise<{
    coach: Student;
    coachee: Pupil;
}> {
    const coachee = await getPupilByWixID(manager, match.helpee.uuid);
    const coach = await getStudentByWixID(manager, match.helper.uuid);

    return {
        coach,
        coachee
    };
}

