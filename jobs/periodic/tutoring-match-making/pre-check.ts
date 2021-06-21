import * as moment from "moment";
import { EntityManager } from "typeorm";
import { latestTutoringMatch } from "../../../common/administration/match-making/tutoring/matches/retrieve";
import { getNumberOfTuteesToMatch } from "../../../common/administration/match-making/tutoring/people/tutees";
import { AUTOMATIC_MATCH_INTERVAL, MIN_TUTEE_COUNT_FOR_MATCH_ATTEMPT } from "./constants";

export async function shouldPerformAutomaticTutoringMatching(manager: EntityManager, restrictToThoseWithConfirmedInterest: boolean): Promise<boolean> {
    //get date of last created tutoring match
    const latestMatch = await latestTutoringMatch(manager);
    const latestMatchDate = latestMatch?.createdAt;

    const timeCriterion = !latestMatch ? false : moment(latestMatchDate).add(AUTOMATIC_MATCH_INTERVAL, "days")
        .isSameOrBefore(moment()); //don't respect time criterion if this couldn't be obtained...

    const numberOfTuteesToMatch = await getNumberOfTuteesToMatch(manager, restrictToThoseWithConfirmedInterest);
    const waitingTuteeCriterion = numberOfTuteesToMatch >= MIN_TUTEE_COUNT_FOR_MATCH_ATTEMPT;

    return timeCriterion || waitingTuteeCriterion;
}