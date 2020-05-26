import { Screening } from "../entity/Screening";
import { Student } from "../entity/Student";

export class StudentToScreen {
    firstName: string;
    lastName: string;
    email: string;
    verified: boolean;
    alreadyScreened: boolean;
    subjects: string;
    msg: string;
    constructor(student: Student, screening: Screening) {
        this.firstName = student.firstname;
        this.lastName = student.lastname;
        this.email = student.email;
        this.subjects = student.subjects;
        this.msg = student.msg;
        if (screening instanceof Screening) {
            this.verified = screening.success;
            this.alreadyScreened = true;
        } else {
            this.verified = false;
            this.alreadyScreened = false;
        }
    }
}
