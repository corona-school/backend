import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import {Pupil} from "../../entity/Pupil";
import {BBBMeeting} from "../../entity/BBBMeeting";
import {Student} from "../../entity/Student";

export default class CreateBBBMeetingEvent extends LogUserEvent {
    constructor(user: Pupil | Student, bbbMeeting: BBBMeeting) {
        super(LogType.CREATED_BBB_MEETING, user, {bbbMeeting: bbbMeeting});
    }
}
