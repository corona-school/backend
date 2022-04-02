import { isEmailAvailable } from "../user/email";
import { prisma } from "../prisma";
import { v4 as uuidv4 } from "uuid";
import * as Notification from "../notification";
import { project_field_with_grade_restriction_projectfield_enum as ProjectField, student_registrationsource_enum as RegistrationSource, student as Student, student_languages_enum as Language, student_state_enum as State, student_module_enum as TeacherModule } from "@prisma/client";
import { Subject } from "../entity/Student";
import { sendFirstInstructorScreeningInvitationMail, sendFirstProjectCoachingJufoAlumniScreeningInvitationMail, sendFirstScreeningInvitationMail } from "../mails/screening";
import { DEFAULT_SCREENER_NUMBER_ID } from "../entity/Screener";
import { TutorJufoParticipationIndication } from "../jufo/participationIndication";
import { logTransaction } from "../transactionlog/log";
import { setProjectFields } from "./update";
import { PrerequisiteError, RedundantError } from "../util/error";

export interface RegisterStudentData {
    firstname: string;
    lastname: string;
    email: string;
    newsletter: boolean;
    registrationSource: RegistrationSource;
    /* After registration, the user receives an email to verify their account.
   The user is redirected to this URL afterwards to continue with whatever they're registering for */
    redirectTo?: string;
}

export interface BecomeInstructorData {
    university: string;
    state: State;
    teacherModule: TeacherModule;
    moduleHours: number;
    message: string;
}

export interface BecomeTutorData {
    subjects: Subject[];
    languages: Language[];
    supportsInDaZ: boolean;
}

export interface ProjectFieldWithGradeData {
    projectField: ProjectField;
    min: number;
    max: number;
}

export interface BecomeProjectCoachData {
    projectFields: ProjectFieldWithGradeData[];
    wasJufoParticipant: TutorJufoParticipationIndication;
    isUniversityStudent: boolean;
    hasJufoCertificate: boolean;
    jufoPastParticipationInfo: string;
}


export async function registerStudent(data: RegisterStudentData) {
    if (!(await isEmailAvailable(data.email))) {
        throw new PrerequisiteError(`Email is already used by another account`);
    }

    const student = await prisma.student.create({
        data: {
            email: data.email.toLowerCase(),
            firstname: data.firstname,
            lastname: data.lastname,
            newsletter: data.newsletter,
            registrationSource: data.registrationSource as any,

            // Compatibility with legacy foreign keys
            wix_id: "Z-" + uuidv4(),
            wix_creation_date: new Date(),

            // the authToken is used to verify the e-mail instead
            verification: uuidv4()
        }
    });

    // TODO: Create a new E-Mail for registration
    // TODO: Send authToken with this
    await Notification.actionTaken(student, "student_registration_started", { redirectTo: data.redirectTo });
    await logTransaction("verificationRequets", student, {});

    return student;
}

export async function becomeInstructor(student: Student, data: BecomeInstructorData) {
    if (student.isInstructor) {
        throw new RedundantError(`Student is already instructor`);
    }

    const { university, message, state, teacherModule, moduleHours } = data;

    await prisma.student.update({
        data: {
            isInstructor: true,
            state,
            university,
            msg: message,
            module: teacherModule,
            moduleHours,
            lastSentInstructorScreeningInvitationDate: new Date()
        },
        where: { id: student.id }
    });


    const wasInstructorScreened = await prisma.instructor_screening.count({ where: { studentId: student.id, success: true } }) > 0;
    if (!wasInstructorScreened) {
        await sendFirstInstructorScreeningInvitationMail(student);
    }
}

export async function becomeTutor(student: Student, data: BecomeTutorData) {
    if (student.isStudent) {
        throw new RedundantError(`Student is already tutor`);
    }

    const { languages, subjects, supportsInDaZ } = data;

    console.log(`BecomeTutor subjects`, JSON.stringify(subjects));

    await prisma.student.update({
        data: {
            isStudent: true,
            openMatchRequestCount: 1,
            subjects: JSON.stringify(subjects),
            languages,
            supportsInDaZ
        },
        where: { id: student.id }
    });

    const isScreenedCoach = await prisma.project_coaching_screening.count({
        where: { studentId: student.id, success: true }
    }) > 0;

    if (isScreenedCoach) {
        await prisma.screening.create({
            data: {
                success: true,
                screenerId: DEFAULT_SCREENER_NUMBER_ID,
                comment: `[AUTOMATICALLY GENERATED SECONDARY SCREENING DUE TO VALID PROJECT COACHING SCREENING]`,
                knowsCoronaSchoolFrom: ""
            }
        });

        await Notification.actionTaken(student, "tutor_screening_success", {});
    }

    // TODO: Currently students are not invited for screening again when they want to become tutors? Why is that?

}

export async function becomeProjectCoach(student: Student, data: BecomeProjectCoachData) {
    if (student.isProjectCoach) {
        throw new RedundantError(`Student is already a coach`);
    }

    const { hasJufoCertificate, isUniversityStudent, jufoPastParticipationInfo, projectFields, wasJufoParticipant } = data;

    if (projectFields) {
        await setProjectFields(student, projectFields);
    }

    await prisma.student.update({
        data: {
            isProjectCoach: true,
            wasJufoParticipant,
            isUniversityStudent,
            hasJufoCertificate,
            jufoPastParticipationInfo
        },
        where: { id: student.id }
    });


    const wasScreened = await prisma.project_coaching_screening.count({ where: { studentId: student.id, success: true } }) > 0;

    if (!wasScreened) {
        if (student.isUniversityStudent) {
            await sendFirstScreeningInvitationMail(student);
            await prisma.student.update({
                data: { lastSentScreeningInvitationDate: new Date() },
                where: { id: student.id }
            });
        } else {
            await sendFirstProjectCoachingJufoAlumniScreeningInvitationMail(student);
            await prisma.student.update({
                data: { lastSentJufoAlumniScreeningInvitationDate: new Date() },
                where: { id: student.id }
            });
        }
    }


}