import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class DeActivateEvent extends LogUserEvent {
    constructor(user: Pupil | Student, newActiveStatus: boolean) {
        super(LogType.DEACTIVATE, user, {
            newStatus: newActiveStatus,
        });
    }
}
