import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Pupil } from "../../entity/Pupil";
import { Subcourse } from "../../entity/Subcourse";

export default class ParticipantLeftCourseEvent extends LogUserEvent {
    constructor(user: Pupil, subcourse: Subcourse) {
        super(LogType.PARTICIPANT_LEFT_COURSE, user, {subcourseID: subcourse.id});
    }
}
