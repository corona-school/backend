import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class UpdateSubjectsEvent extends LogUserEvent {
    constructor(user: Pupil | Student, oldSubjects: Array<any>) {
        super(LogType.UPDATE_SUBJECTS, user, {
            oldSubjects: oldSubjects
        });
    }
}
