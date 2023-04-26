import { EntityManager } from "typeorm";
import { numberOfMatchablePupilsWithConfirmedInterest as totalNumberOfMatchablePupilsWithConfirmedInterest } from "./people/pupils";
import { totalNumberOfAllowedOpenMatchRequestsOfStudents } from "./people/students";

const EXPECTED_PERECENT_OF_COMFIRMATIONS = 0.66;

export async function numberOfPupilsToRemindNow(manager: EntityManager): Promise<number> {
    //get the number of matches that could be created in theory from an offer-perspective
    const matchOfferCount = await totalNumberOfAllowedOpenMatchRequestsOfStudents(manager);

    //get number of pupils that have confirmed their interest, but who are still waiting to get a match
    const matchDemandCount = await totalNumberOfMatchablePupilsWithConfirmedInterest(manager);

    //compute how many pupils to remind now
    const estimation = Math.floor((matchOfferCount - matchDemandCount)/EXPECTED_PERECENT_OF_COMFIRMATIONS);

    //return either 0 or that result above
    return Math.max(0, estimation);
}