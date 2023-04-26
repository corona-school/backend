import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class FetchedFromWixEvent extends LogUserEvent {
    constructor(user: Pupil | Student) {
        super(LogType.FETCHED_FROM_WIX, user, {});
    }
}
