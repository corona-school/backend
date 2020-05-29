import LogEvent from "./LogEvent";
import LogType from "./LogType";
import EventData from "./EventData";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default abstract class LogUserEvent extends LogEvent {
    protected constructor(logType: LogType, user: Pupil | Student, data: EventData) {
        super(logType, user.wix_id, data);
    }
}
