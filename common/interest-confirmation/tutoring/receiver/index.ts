import { EntityManager } from "typeorm";
import { numberOfPupilsToRemindNow } from "./limit-prediction";
import { getAllMatchablePupilsWithoutInterestConfirmationRequest, getAllMatchableUnremindedPupilsWithPendingConfirmationRequest } from "./people/pupils";


/// Return all pupils that should NOW get the initial request to confirm their interest
export async function getAllPupilsToSendInitialInterestConfirmationRequest(manager: EntityManager) {
    //compute a limit on how many people should NOW be able to receive the initial request
    const limit = await numberOfPupilsToRemindNow(manager);

    if (limit <= 0) {
        return []; //don't go into the database, because typeorm's take/limit doesn't work as documented or expected, see: https://github.com/typeorm/typeorm/issues/4883 (but of course, we can also interpret this as a shortcut...)
    }

    //get the pupils
    const pupils = await getAllMatchablePupilsWithoutInterestConfirmationRequest(manager, limit);

    //return the results
    return pupils;
}


/// Return all pupils that should NOW get to be reminded of their interest confirmation request
export async function getAllPupilsToBeRemindedOfInterestConfirmationRequest(manager: EntityManager, daysAfterInitialRequest: number) {
    //get the pupils
    const pupils = await getAllMatchableUnremindedPupilsWithPendingConfirmationRequest(manager, daysAfterInitialRequest);

    return pupils;
}