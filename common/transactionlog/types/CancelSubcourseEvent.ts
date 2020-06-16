import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Subcourse } from "../../entity/Subcourse";

export default class CancelSubcourseEvent extends LogUserEvent {
    constructor(instructor: Student, subcourse: Subcourse) {
        super(LogType.CANCELLED_SUBCOURSE, instructor, {id: subcourse.id});
    }
}
