import { Match } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { Match as DatabaseMatch, MatchPair} from "../../../../entity/Match";
import { getPupilByWixID } from "../../../../entity/Pupil";
import { getStudentByWixID } from "../../../../entity/Student";


export async function saveMatchToDB(match: Match, manager: EntityManager): Promise<DatabaseMatch> {
    //get both persons (reload them from the database to get the latest value for openMatchRequestCount)
    const pupil = await getPupilByWixID(manager, match.helpee.uuid);
    const student = await getStudentByWixID(manager, match.helper.uuid);

    //create match
    const tutoringMatch = new DatabaseMatch(pupil, student);

    //decrease open match requests count
    pupil.openMatchRequestCount -= 1;
    student.openMatchRequestCount -= 1;

    //save
    await manager.save(tutoringMatch);
    await manager.save(pupil);
    await manager.save(student);

    return tutoringMatch;
}


export async function saveMatchingToDB(matches: Match[], manager: EntityManager): Promise<DatabaseMatch[]> {
    const savedMatches: DatabaseMatch[] = [];
    for (const m of matches) { //use loop to have no interplay between concurrent Promises
        savedMatches.push(await saveMatchToDB(m, manager));
    }
    return savedMatches;
}