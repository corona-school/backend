import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";

export default class VerificationRequestEvent extends LogUserEvent {
    constructor(user: { wix_id: string }) {
        super(LogType.VERIFICATION_REQUEST, user, {});
    }
}
