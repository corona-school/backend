import { Subject, TeacherModule } from "../entity/Student";
import { TutorJufoParticipationIndication } from "../jufo/participationIndication";
import { isValidProjectFieldWithGradeInfo, ProjectFieldWithGradeInfoType } from "../jufo/projectFieldWithGradeInfoType";
import { EnumReverseMappings } from "../util/enumReverseMapping";
import { hasRequiredScreeningInfo, ScreeningInfo } from "../util/screening";
import { isValidSubject } from "../util/subjectsutils";


/**
 * @apiDefine StudentEditableInfo
 * @apiVersion 1.0.0
 *
 * @apiParam (StudentEditableInfo) {boolean} isTutor whether is 1-on-1 learning tutor
 * @apiParam (StudentEditableInfo) {boolean} isInstructor whether wants to give courses or not
 * @apiParam (StudentEditableInfo) {boolean} isProjectCourse whether wants to give project coaching
 * @apiParam (StudentEditableInfo) {Object} screenings Information on the available screenings. Only those are not null/undefined which exist/should exist
 * @apiParam (StudentEditableInfo) {Object[]} projectFields All project fields for 1-on-1 project coaching
 * @apiParam (StudentEditableInfo) {Object[]} subjects All subjects for 1-on-1 tutoring
 * @apiParam (StudentEditableInfo) {string} [feedback] The student's feedback
 * @apiParam (StudentEditableInfo) {string} [phone] The student's phone number
 * @apiParam (StudentEditableInfo) {boolean} newsletter Student wanna subscribe newsletter or not
 * @apiParam (StudentEditableInfo) {string} [msg] The student's message.
 * @apiParam (StudentEditableInfo) {string} [university] The student's university.
 * @apiParam (StudentEditableInfo) {string} [state] The student's state.
 * @apiParam (StudentEditableInfo) {boolean} [isUniversityStudent] The student is official registered student (for jufo) or not.
 * @apiParam (StudentEditableInfo) {boolean} [jufoPastParticipationConfirmed] Can be one of null/true/false and indicates if Corona School has gotten information on whether a student was really a past jufo participant.
 * @apiParam (StudentEditableInfo) {boolean} [wasJufoParticipant] One of "yes"/"no"/"idk". Indicates whether this person was a past jufo participant.
 * @apiParam (StudentEditableInfo) {boolean} [hasJufoCertificate] Indicates if the person has a jufo certificate that can be shown in the screening interview.
 * @apiParam (StudentEditableInfo) {boolean} [jufoPastParticipationInfo] A string with info on the person's past jufo participation.
 * @apiParam (StudentEditableInfo) {Object} [official] Information on the student if official (internship/DLL);
 *
 */
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
    jufoPastParticipationConfirmed?: boolean;
    wasJufoParticipant?: TutorJufoParticipationIndication;
    hasJufoCertificate?: boolean;
    jufoPastParticipationInfo?: string;
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
                                        && (this.isUniversityStudent ? typeof this.isUniversityStudent === "boolean" : true)
                                        && (this.jufoPastParticipationConfirmed ? typeof this.jufoPastParticipationConfirmed === "boolean" : true)
                                        && (this.wasJufoParticipant ? (typeof this.wasJufoParticipant === "string" && EnumReverseMappings.TutorJufoParticipationIndication(this.wasJufoParticipant)) : true)
                                        && (this.hasJufoCertificate ? typeof this.hasJufoCertificate === "boolean" : true)
                                        && (this.jufoPastParticipationInfo ? typeof this.wasJufoParticipant === "string" : true);

        const checkState = this.state ? typeof this.state === "string" && !!EnumReverseMappings.State(this.state) : true;

        return validRoles && validScreenings && validProjectFields && validSubjects && isValidOfficial && validRemainingFields && checkState;
    }
}