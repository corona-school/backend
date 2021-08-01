import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";

export default class ParticipantJoinedCourseEvent extends LogUserEvent {
    constructor(user: { wix_id: string }, subcourse: { id: number }) {
        super(LogType.PARTICIPANT_JOINED_COURSE, user, {subcourseID: subcourse.id});
    }
}
