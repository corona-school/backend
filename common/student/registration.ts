import { isEmailAvailable } from '../user/email';
import { prisma } from '../prisma';
import { v4 as uuidv4 } from 'uuid';
import * as Notification from '../notification';
import {
    project_field_with_grade_restriction_projectfield_enum as ProjectField,
    student_registrationsource_enum as RegistrationSource,
    student as Student,
    student_languages_enum as Language,
    student_state_enum as State,
    student_module_enum as TeacherModule,
    Prisma,
    PrismaClient,
} from '@prisma/client';
import { DEFAULT_SCREENER_NUMBER_ID } from '../entity/Screener';
import { logTransaction } from '../transactionlog/log';
import { PrerequisiteError, RedundantError } from '../util/error';
import { toStudentSubjectDatabaseFormat, Subject } from '../util/subjectsutils';
import { DISABLED_NEWSLETTER, ENABLED_NEWSLETTER } from '../notification/defaultPreferences';
import { userForStudent } from '../user';

export interface RegisterStudentData {
    firstname: string;
    lastname: string;
    email: string;
    newsletter: boolean;
    registrationSource: RegistrationSource;
    aboutMe: string;
    /* After registration, the user receives an email to verify their account.
   The user is redirected to this URL afterwards to continue with whatever they're registering for */
    redirectTo?: string;
}

export interface BecomeInstructorData {
    // Message to the Screener, this for sure makes little sense if the screener does this on behalf of the student
    message?: string;
}

export interface BecomeTutorData {
    // It would make sense to fill these infos here as otherwise the tutor won't be matched,
    // though this can also be done later with updateStudent
    subjects?: Subject[];
    languages?: Language[];
    supportsInDaZ?: boolean;
}

export interface ProjectFieldWithGradeData {
    projectField: ProjectField;
    min: number;
    max: number;
}

export async function registerStudent(data: RegisterStudentData, noEmail = false, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    if (!(await isEmailAvailable(data.email))) {
        throw new PrerequisiteError(`Email is already used by another account`);
    }

    const student = await prismaInstance.student.create({
        data: {
            email: data.email.toLowerCase(),
            firstname: data.firstname,
            lastname: data.lastname,
            newsletter: data.newsletter,
            registrationSource: data.registrationSource as any,
            aboutMe: data.aboutMe,

            // Compatibility with legacy foreign keys
            wix_id: 'Z-' + uuidv4(),
            wix_creation_date: new Date(),

            // the authToken is used to verify the e-mail instead
            verification: uuidv4(),

            openMatchRequestCount: 0,
            notificationPreferences: data.newsletter ? ENABLED_NEWSLETTER : DISABLED_NEWSLETTER,
        },
    });

    if (!noEmail) {
        await Notification.actionTaken(userForStudent(student), 'student_registration_started', { redirectTo: data.redirectTo ?? '' });
    }

    await logTransaction('verificationRequets', student, {});

    return student;
}

export async function becomeInstructor(student: Student, data?: BecomeInstructorData) {
    if (student.isInstructor) {
        throw new RedundantError(`Student is already instructor`);
    }

    return await prisma.student.update({
        data: {
            isInstructor: true,
            msg: data ? data.message : '',
            lastSentInstructorScreeningInvitationDate: new Date(),
        },
        where: { id: student.id },
    });
}

export async function becomeTutor(
    student: Student,
    data?: BecomeTutorData,
    prismaInstance: Prisma.TransactionClient | PrismaClient = prisma,
    batchMode = false
) {
    if (student.isStudent) {
        throw new RedundantError(`Student is already tutor`);
    }

    const res = await prismaInstance.student.update({
        data: {
            isStudent: true,
            openMatchRequestCount: 0,
            subjects: data ? JSON.stringify(data.subjects.map(toStudentSubjectDatabaseFormat)) : undefined,
            languages: data ? data.languages : undefined,
            supportsInDaZ: data ? data.supportsInDaZ : undefined,
        },
        where: { id: student.id },
    });

    const isScreenedCoach =
        (await prismaInstance.project_coaching_screening.count({
            where: { studentId: student.id, success: true },
        })) > 0;

    if (isScreenedCoach) {
        await prismaInstance.screening.create({
            data: {
                success: true,
                screenerId: DEFAULT_SCREENER_NUMBER_ID,
                comment: `[AUTOMATICALLY GENERATED SECONDARY SCREENING DUE TO VALID PROJECT COACHING SCREENING]`,
                knowsCoronaSchoolFrom: '',
            },
        });
        if (!batchMode) {
            await Notification.actionTaken(userForStudent(student), 'tutor_screening_success', {});
        }
    }
    return res;
    // TODO: Currently students are not invited for screening again when they want to become tutors? Why is that?
}
