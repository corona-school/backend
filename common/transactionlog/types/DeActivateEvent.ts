import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class DeActivateEvent extends LogUserEvent {
    constructor(user: Pupil | Student, newActiveStatus: boolean, deactivationReason?: string, deactivationFeedback?: string) {
        super(LogType.DEACTIVATE, user, {
            newStatus: newActiveStatus,
            deactivationReason,
            deactivationFeedback
        });
    }
}
