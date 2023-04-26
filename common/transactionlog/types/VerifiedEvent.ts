import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class VerifiedEvent extends LogUserEvent {
    constructor(user: Pupil | Student) {
        super(LogType.VERIFIED, user, {});
    }
}
