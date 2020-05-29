import LogUserEvent from "./LogUserEvent";
import LogType from "./LogType";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export default class UpdateStudentDescriptionEvent extends LogUserEvent {
    constructor(student: Student, oldStudent: Student) {
        super(LogType.UPDATE_STUDENT_DESCRIPTION, student, {oldDescription: oldStudent.instructorDescription});
    }
}
