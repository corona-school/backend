import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Pupil } from "../../entity/Pupil";
import { Course } from "../../entity/Course";
import { Student } from "../../entity/Student";

export default class AccessedCourseEvent extends LogUserEvent {
    constructor(user: Pupil | Student, course: Course) {
        super(LogType.ACCESSED_COURSED, user, {course: course.id});
    }
}
