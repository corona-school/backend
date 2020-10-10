import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";
import {Mentor} from "../../entity/Mentor";

export default class VerificationRequestEvent extends LogUserEvent {
    constructor(user: Pupil | Student | Mentor) {
        super(LogType.VERIFICATION_REQUEST, user, {});
    }
}
