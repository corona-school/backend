import LogUserEvent from "./LogUserEvent";
import { Pupil } from "../../entity/Pupil";
import { Student } from "../../entity/Student";
import LogType from "./LogType";

export default class UpdatedByScreenerEvent extends LogUserEvent {
    constructor(user: Pupil | Student, screener: string) {
        super(LogType.UPDATED_BY_SCREENER, user, { screener: screener });
    }
}
