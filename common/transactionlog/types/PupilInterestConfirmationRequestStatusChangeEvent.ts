import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { InterestConfirmationStatus, PupilTutoringInterestConfirmationRequest } from "../../entity/PupilTutoringInterestConfirmationRequest";

export default class PupilInterestConfirmationRequestStatusChangeEvent extends LogUserEvent {
    constructor(pticr: PupilTutoringInterestConfirmationRequest, previousStatus?: InterestConfirmationStatus) {
        super(LogType.PUPIL_INTEREST_CONFIRMATION_REQUEST_STATUS_CHANGE, pticr.pupil, {
            changeDate: pticr.updatedAt,
            newStatus: pticr.status,
            previousStatus
        });
    }
}
