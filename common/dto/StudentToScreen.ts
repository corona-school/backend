import { ApiProjectFieldInfo } from "../../web/controllers/userController/format";
import { ProjectCoachingScreening } from "../entity/ProjectCoachingScreening";
import { ProjectFieldWithGradeRestriction } from "../entity/ProjectFieldWithGradeRestriction";
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
    isProjectCoach: boolean;
    projectFields: ApiProjectFieldInfo[];
    projectCoachingScreeningStatus: {
        alreadyScreened: boolean;
        verified: boolean;
    };
    constructor(student: Student, screening: Screening, projectCoachingScreening?: ProjectCoachingScreening, projectFields?: ProjectFieldWithGradeRestriction[]) {
        this.firstName = student.firstname;
        this.lastName = student.lastname;
        this.email = student.email;
        this.subjects = student.subjects;
        this.msg = student.msg;
        this.isProjectCoach = student.isProjectCoach;
        this.projectFields = projectFields?.map(pf => {
            return {
                name: pf.projectField,
                min: pf.min,
                max: pf.max
            };
        }) ?? [];
        if (screening instanceof Screening) {
            this.verified = screening.success;
            this.alreadyScreened = true;
        } else {
            this.verified = false;
            this.alreadyScreened = false;
        }
        this.projectCoachingScreeningStatus = {
            alreadyScreened: !!projectCoachingScreening,
            verified: projectCoachingScreening?.success ?? screening?.success ?? false
        };
    }
}
