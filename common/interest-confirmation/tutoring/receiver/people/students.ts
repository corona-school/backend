import { EntityManager } from "typeorm";
import { tutorsToMatch } from "../../../../administration/match-making/tutoring/people/tutors";

export async function totalNumberOfAllowedOpenMatchRequestsOfStudents(manager: EntityManager): Promise<number> {
    return (await tutorsToMatch(manager)).reduce( (acc, s) => acc + s.openMatchRequestCount, 0);
}