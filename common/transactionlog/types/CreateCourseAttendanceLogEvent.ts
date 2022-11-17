import LogUserEvent from './LogUserEvent';
import LogType from './LogType';
import { CourseAttendanceLog } from '../../entity/CourseAttendanceLog';
import { Pupil } from '../../entity/Pupil';

export default class CreateCourseAttendanceLogEvent extends LogUserEvent {
    constructor(pupil: Pupil, courseAttendanceLog: CourseAttendanceLog) {
        let log = Object.assign({}, courseAttendanceLog);
        log.ip = undefined;
        super(LogType.CREATED_COURSE_ATTENDANCE_LOG, pupil, { courseAttendanceLog: courseAttendanceLog });
    }
}
