import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { PupilTutoringInterestConfirmationRequest } from "../../entity/PupilTutoringInterestConfirmationRequest";

export default class PupilInterestConfirmationRequestReminderSentEvent extends LogUserEvent {
    constructor(pticr: PupilTutoringInterestConfirmationRequest) {
        super(LogType.PUPIL_INTEREST_CONFIRMATION_REQUEST_REMINDER_SENT, pticr.pupil, { sendDate: new Date() });
    }
}
