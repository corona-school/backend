import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class VerifiedCodeEvent extends LogUserEvent {
    constructor(user: Pupil | Student) {
        super(LogType.VERIFIED_CODE, user, {});
    }
}
