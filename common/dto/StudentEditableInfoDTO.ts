import { Subject, TeacherModule } from "../entity/Student";
import { isValidProjectFieldWithGradeInfo, ProjectFieldWithGradeInfoType } from "../jufo/projectFieldWithGradeInfoType";
import { EnumReverseMappings } from "../util/enumReverseMapping";
import { hasRequiredScreeningInfo, ScreeningInfo } from "../util/screening";
import { isValidSubject } from "../util/subjectsutils";

export class StudentEditableInfoDTO {
    isTutor: boolean;
    isInstructor: boolean;
    isProjectCoach: boolean;
    screenings: {
        tutor?: ScreeningInfo; //if null/undefined, the screening is removed
        instructor?: ScreeningInfo;
        projectCoach?: ScreeningInfo;
    };
    projectFields: ProjectFieldWithGradeInfoType[];
    subjects: Subject[];
    feedback?: string;
    phone?: string;
    newsletter: boolean;
    msg?: string;
    university?: string;
    state?: string;
    isUniversityStudent?: boolean;
    official?: {
        hours: number;
        module: TeacherModule;
    };

    isValid(): boolean {
        const validRoles = typeof this.isTutor === "boolean"
                            && typeof this.isInstructor === "boolean"
                            && typeof this.isProjectCoach === "boolean";

        const validScreenings = [this.screenings.tutor ?? [], this.screenings.instructor ?? [], this.screenings.projectCoach ?? []].flat().every(hasRequiredScreeningInfo);

        const validProjectFields = this.projectFields.every(isValidProjectFieldWithGradeInfo);

        const validSubjects = this.subjects.every(isValidSubject);

        const isValidOfficial = this.official ? typeof this.official.hours === "number" && typeof this.official.module === "string" && EnumReverseMappings.TeacherModule(this.official.module) : true;

        const validRemainingFields = (this.feedback ? typeof this.feedback === "string" : true)
                                        && (this.phone ? typeof this.phone === "string" : true)
                                        && typeof this.newsletter === "boolean"
                                        && (this.msg ? typeof this.msg === "string" : true)
                                        && (this.university ? typeof this.university === "string" : true)
                                        && (this.isUniversityStudent ? typeof this.isUniversityStudent === "boolean" : true);

        const checkState = this.state ? typeof this.state === "string" && !!EnumReverseMappings.State(this.state) : true;

        return validRoles && validScreenings && validProjectFields && validSubjects && isValidOfficial && validRemainingFields && checkState;
    }
}