import { Student } from "../entity/Student";
import { screeningInfoFrom } from "../util/screening";
import { StudentEditableInfoDTO } from "./StudentEditableInfoDTO";

export class StudentInfoDTO extends StudentEditableInfoDTO {
    firstName: string;
    lastName: string;

    public static async buildFrom(student: Student) {
        const s = new StudentInfoDTO();

        //default metadata
        s.firstName = student.firstname;
        s.lastName = student.lastname;
        s.email = student.email;
        s.feedback = student.feedback;
        s.phone = student.phone;
        s.newsletter = student.newsletter;
        s.msg = student.msg;
        s.university = student.university;
        s.state = student.state;
        s.isUniversityStudent = student.isUniversityStudent;
        s.jufoPastParticipationConfirmed = student.jufoPastParticipationConfirmed;
        s.wasJufoParticipant = student.wasJufoParticipant;
        s.hasJufoCertificate = student.hasJufoCertificate;
        s.jufoPastParticipationInfo = student.jufoPastParticipationInfo;
        s.verifiedAt = student.verifiedAt;
        //official
        if (student.module && student.moduleHours) {
            s.official = {
                module: student.module,
                hours: student.moduleHours
            };
        }

        //role info
        s.isTutor = student.isStudent;
        s.isInstructor = student.isInstructor;
        s.isProjectCoach = student.isProjectCoach;

        //subjects + project fields
        s.subjects = student.getSubjectsFormatted();
        s.projectFields = await student.getProjectFields();

        //screenings
        const tutorScreening = await student.screening;
        const instructorScreening = await student.instructorScreening;
        const projectCoachingScreening = await student.projectCoachingScreening;

        s.screenings = {
            tutor: screeningInfoFrom(tutorScreening),
            instructor: screeningInfoFrom(instructorScreening),
            projectCoach: screeningInfoFrom(projectCoachingScreening)
        };

        return s;
    }
}
