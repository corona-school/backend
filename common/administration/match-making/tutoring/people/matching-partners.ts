import { Match as AlgoMatch } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { getPupilByWixID, Pupil } from "../../../../entity/Pupil";
import { getStudentByWixID, Student } from "../../../../entity/Student";

export async function getMatchingPartners(match: AlgoMatch, manager: EntityManager): Promise<{
    tutor: Student;
    tutee: Pupil;
}> {
    const tutee = await getPupilByWixID(manager, match.helpee.uuid);
    const tutor = await getStudentByWixID(manager, match.helper.uuid);

    return {
        tutor,
        tutee
    };
}

