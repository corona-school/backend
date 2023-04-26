import { EntityManager } from "typeorm";
import { PupilTutoringInterestConfirmationRequest } from "../../../entity/PupilTutoringInterestConfirmationRequest";

export async function saveTutoringInterestConfirmationRequestAsReminded(request: PupilTutoringInterestConfirmationRequest, manager: EntityManager) {
    //update reminded date
    request.reminderSentDate = new Date();

    //save confirmation request
    await manager.save(request);
}

export async function saveTutoringInterestConfirmationRequestsAsReminded(requests: PupilTutoringInterestConfirmationRequest[], manager: EntityManager) {
    return await Promise.all(requests.map(p => saveTutoringInterestConfirmationRequestAsReminded(p, manager)));
}