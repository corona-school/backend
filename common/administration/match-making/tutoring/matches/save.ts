import { Match } from "corona-school-matching";
import { EntityManager } from "typeorm";
import { Match as DatabaseMatch, MatchPair} from "../../../../entity/Match";
import { getPupilByWixID } from "../../../../entity/Pupil";
import { getStudentByWixID } from "../../../../entity/Student";


export async function saveMatchPairToDB(matchPair: MatchPair, manager: EntityManager): Promise<DatabaseMatch> {
    const pupil = matchPair.pupil;
    const student = matchPair.student;

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
export async function saveMatchToDB(match: Match, manager: EntityManager): Promise<DatabaseMatch> {
    //get both persons
    const pupil = await getPupilByWixID(manager, match.helpee.uuid);
    const student = await getStudentByWixID(manager, match.helper.uuid);

    return await saveMatchPairToDB({
        pupil,
        student
    }, manager);
}


export async function saveMatchingToDB(matches: Match[], manager: EntityManager): Promise<DatabaseMatch[]> {
    return await Promise.all(matches.map(m => saveMatchToDB(m, manager)));
}
export async function saveMatchPairsToDB(matchPairs: MatchPair[], manager: EntityManager): Promise<DatabaseMatch[]> {
    return await Promise.all(matchPairs.map(mp => saveMatchPairToDB(mp, manager)));
}