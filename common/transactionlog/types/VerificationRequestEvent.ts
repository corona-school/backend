import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class VerificationRequestEvent extends LogUserEvent {
    constructor(user: Pupil | Student) {
        super(LogType.VERIFICATION_REQUEST, user, {});
    }
}
