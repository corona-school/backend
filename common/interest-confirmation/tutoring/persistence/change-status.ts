import { EntityManager } from "typeorm";
import { InterestConfirmationStatus, PupilTutoringInterestConfirmationRequest } from "../../../entity/PupilTutoringInterestConfirmationRequest";
import { getTransactionLog } from "../../../transactionlog";
import PupilInterestConfirmationRequestStatusChangeEvent from "../../../transactionlog/types/PupilInterestConfirmationRequestStatusChangeEvent";

export async function changeStatus(token: string, status: InterestConfirmationStatus, manager: EntityManager) {
    //get db confirmation request
    const confirmationRequest = await manager.findOne(PupilTutoringInterestConfirmationRequest, {
        token
    }, {
        relations: ["pupil"]
    });

    if (!confirmationRequest) {
        throw new Error(`Cannot find PupilTutoringInterestConfirmationRequest with token ${token}`);
    }

    //store previous status for transaction log
    const previousStatus = confirmationRequest.status;

    //change status
    confirmationRequest.status = status;

    //save changes
    await manager.save(confirmationRequest);

    //transaction log
    const transactionLog = getTransactionLog();
    transactionLog.log(new PupilInterestConfirmationRequestStatusChangeEvent(confirmationRequest, previousStatus));
}