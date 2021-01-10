import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Pupil } from "../../entity/Pupil";
import { Subcourse } from "../../entity/Subcourse";

export default class ParticipantJoinedCourseEvent extends LogUserEvent {
    constructor(user: Pupil, subcourse: Subcourse) {
        super(LogType.PARTICIPANT_JOINED_COURSE, user, {subcourseID: subcourse.id});
    }
}
