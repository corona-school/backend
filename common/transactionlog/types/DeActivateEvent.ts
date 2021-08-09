import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";
import { student, pupil } from "@prisma/client";

export default class DeActivateEvent extends LogUserEvent {
    constructor(user: Pupil | Student | pupil | student, newActiveStatus: boolean, deactivationReason?: string, deactivationFeedback?: string) {
        super(LogType.DEACTIVATE, user, {
            newStatus: newActiveStatus,
            deactivationReason,
            deactivationFeedback
        });
    }
}
