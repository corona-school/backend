import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { pupil as Pupil, subcourse as Subcourse } from "@prisma/client";

export default class ParticipantLeftCourseEvent extends LogUserEvent {
    constructor(user: Pupil, subcourse: Subcourse) {
        super(LogType.PARTICIPANT_LEFT_COURSE, user, {subcourseID: subcourse.id});
    }
}
