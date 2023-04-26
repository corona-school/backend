import { Match } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { ProjectMatch as DatabaseProjectMatch, ProjectMatch} from "../../../../entity/ProjectMatch";
import { getPupilByWixID } from "../../../../entity/Pupil";
import { getStudentByWixID } from "../../../../entity/Student";


export async function saveMatchToDB(match: Match, manager: EntityManager): Promise<DatabaseProjectMatch> {
    //get both persons
    const pupil = await getPupilByWixID(manager, match.helpee.uuid);
    const student = await getStudentByWixID(manager, match.helper.uuid);

    //create match
    const projectMatch = new ProjectMatch(pupil, student);

    //decrease open match requests count
    pupil.openProjectMatchRequestCount -= 1;
    student.openProjectMatchRequestCount -= 1;

    //save
    await manager.save(projectMatch);
    await manager.save(pupil);
    await manager.save(student);

    return projectMatch;
}

export async function saveMatchingToDB(matches: Match[], manager: EntityManager): Promise<DatabaseProjectMatch[]> {
    const savedProjectMatches: DatabaseProjectMatch[] = [];
    for (const m of matches) {
        savedProjectMatches.push(await saveMatchToDB(m, manager));
    }
    return savedProjectMatches;
}