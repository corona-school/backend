import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Course } from "../../entity/Course";

export default class CreateCourseEvent extends LogUserEvent {
    constructor(student: Student, course: Course) {
        super(LogType.CREATED_COURSE, student, {id: course.id});
    }
}
