import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { pupil as Pupil, subcourse as Subcourse } from "@prisma/client";

export default class ParticipantLeftCourseEvent extends LogUserEvent {
    constructor(user: { wix_id: string }, subcourse: { id: number }) {
        super(LogType.PARTICIPANT_LEFT_COURSE, user, {subcourseID: subcourse.id});
    }
}
