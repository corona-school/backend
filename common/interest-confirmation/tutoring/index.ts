import { EntityManager } from "typeorm";
import { sendTutoringConfirmationRequestReminders, sendTutoringConfirmationRequests } from "./notify/send";
import { createTutoringInterestConfirmationRequests } from "./persistence/create";
import { saveTutoringInterestConfirmationRequestsAsReminded } from "./persistence/remind";
import { getAllPupilsToBeRemindedOfInterestConfirmationRequest, getAllPupilsToSendInitialInterestConfirmationRequest } from "./receiver";

const DAYS_AFTER_INITIAL_REQUEST = 7;

/// Send out initial interest confirmation requests to all applicable pupils
export async function requestInterestConfirmationOfNextPupils(manager: EntityManager) {
    // get pupils to remind
    const pupils = await getAllPupilsToSendInitialInterestConfirmationRequest(manager);

    // create and save the corresponding PupilTutoringInterestConfirmationRequest in DB
    const requests = await createTutoringInterestConfirmationRequests(pupils, manager);

    // send out the notifications
    await sendTutoringConfirmationRequests(requests, manager);
}

/// Remind all applicable pupils who haven't answered the interest confirmation request yet
export async function remindNextPupils(manager: EntityManager) {
    // get pupils to remind
    const pupils = await getAllPupilsToBeRemindedOfInterestConfirmationRequest(manager, DAYS_AFTER_INITIAL_REQUEST);
    const requests = pupils.map(p => p.tutoringInterestConfirmationRequest);

    // persist the remind state
    await saveTutoringInterestConfirmationRequestsAsReminded(requests, manager);

    // send out notifications
    await sendTutoringConfirmationRequestReminders(requests, manager);
}