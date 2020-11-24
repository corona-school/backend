import * as moment from "moment";
import { EntityManager } from "typeorm";
import { latestProjectCoachingMatch } from "../../../common/administration/match-making/project-coaching/matches/retrieve";
import { getNumberOfCoacheesToMatch } from "../../../common/administration/match-making/project-coaching/people/coachees";
import { AUTOMATIC_MATCH_INTERVAL, MIN_COACHEE_COUNT_FOR_MATCH_ATTEMPT } from "./constants";

export async function shouldPerformAutomaticProjectCoachingMatching(manager: EntityManager): Promise<boolean> {
    //get date of last created project coaching match
    const latestProjectMatch = await latestProjectCoachingMatch(manager);
    const latestMatchDate = latestProjectMatch?.createdAt;

    const timeCriterion = !latestProjectMatch ? false : moment(latestMatchDate).add(AUTOMATIC_MATCH_INTERVAL, "days").isSameOrBefore(moment()); //don't respect time criterion if this couldn't be obtained...
    const waitingCoacheeCriterion = await getNumberOfCoacheesToMatch(manager) >= MIN_COACHEE_COUNT_FOR_MATCH_ATTEMPT;

    return timeCriterion || waitingCoacheeCriterion;
}