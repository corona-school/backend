import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Course } from "../../entity/Course";

export default class CancelCourseEvent extends LogUserEvent {
    constructor(instructor: Student, course: Course) {
        super(LogType.CANCELLED_COURSE, instructor, {id: course.id});
    }
}
