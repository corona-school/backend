import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Course } from "../../entity/Course";
import {CourseAttendanceLog} from "../../entity/CourseAttendanceLog";
import {Pupil} from "../../entity/Pupil";

export default class CreateCourseAttendanceLogEvent extends LogUserEvent {
    constructor(pupil: Pupil, courseAttendanceLog: CourseAttendanceLog) {
        super(LogType.CREATED_COURSE_ATTENDANCE_LOG, pupil, {courseAttendanceLog: courseAttendanceLog});
    }
}
