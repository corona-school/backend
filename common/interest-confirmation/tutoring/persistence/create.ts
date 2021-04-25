import { EntityManager } from "typeorm";
import { Pupil } from "../../../entity/Pupil";
import { createUniqueToken, PupilTutoringInterestConfirmationRequest } from "../../../entity/PupilTutoringInterestConfirmationRequest";

export async function createTutoringInterestConfirmationRequest(pupil: Pupil, manager: EntityManager) {
    // create tutoring interest confirmation request
    const token = await createUniqueToken(manager);
    const confirmationRequest = new PupilTutoringInterestConfirmationRequest(pupil, token);

    //save confirmation request
    await manager.save(confirmationRequest);

    return confirmationRequest;
}

export async function createTutoringInterestConfirmationRequests(pupils: Pupil[], manager: EntityManager) {
    const requests: PupilTutoringInterestConfirmationRequest[] = [];
    for (const p of pupils) { //without concurrency, since we're using unique token generation, which isn't necessarily safe.
        requests.push(await createTutoringInterestConfirmationRequest(p, manager));
    }
    return requests;
}