import LogUserEvent from "./LogUserEvent";
import { Pupil } from "../../entity/Pupil";
import { Student } from "../../entity/Student";
import LogType from "./LogType";

export default class AccessedByScreenerEvent extends LogUserEvent {
    constructor(user: Pupil | Student, screener: string) {
        super(LogType.ACCESSED_BY_SCREENER, user, { screener: screener });
    }
}
