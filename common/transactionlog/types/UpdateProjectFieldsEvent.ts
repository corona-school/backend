import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class UpdateProjectFieldsEvent extends LogUserEvent {
    constructor(user: Pupil | Student, oldProjectFields: Array<any>) {
        super(LogType.UPDATE_PROJECTFIELDS, user, {
            oldProjectFields
        });
    }
}
