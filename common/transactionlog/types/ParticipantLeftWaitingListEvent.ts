import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Pupil } from "../../entity/Pupil";
import { Course } from "../../entity/Course";

export default class ParticipantLeftWaitingListEvent extends LogUserEvent {
    constructor(user: Pupil, course: Course) {
        super(LogType.PARTICIPANT_LEFT_WAITING_LIST, user, {courseID: course.id});
    }
}
