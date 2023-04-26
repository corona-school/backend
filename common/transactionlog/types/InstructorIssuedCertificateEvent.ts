import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Pupil } from "../../entity/Pupil";
import { Subcourse } from "../../entity/Subcourse";
import { Student } from "../../entity/Student";

export default class InstructorIssuedCertificateEvent extends LogUserEvent {
    constructor(user: Student, receiver: Pupil, subcourse: Subcourse) {
        super(LogType.INSTRUCTOR_ISSUED_CERTIFICATE, user, {subcourseID: subcourse.id, pupilID: receiver.id});
    }
}
