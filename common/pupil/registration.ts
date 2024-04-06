import { prisma } from '../prisma';
import { isEmailAvailable } from '../user/email';
import { v4 as uuidv4 } from 'uuid';
import * as Notification from '../notification';
import {
    pupil_projectfields_enum as ProjectField,
    pupil_state_enum as State,
    pupil as Pupil,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_languages_enum as Language,
    pupil_learninggermansince_enum,
    school as School,
    pupil_schooltype_enum as SchoolType,
    Prisma,
    PrismaClient,
} from '@prisma/client';
import { logTransaction } from '../transactionlog/log';
import { PrerequisiteError, RedundantError } from '../util/error';
import { toPupilSubjectDatabaseFormat, Subject } from '../util/subjectsutils';
import { DISABLED_NEWSLETTER, ENABLED_NEWSLETTER } from '../notification/defaultPreferences';
import { userForPupil } from '../user';

export interface RegisterPupilData {
    firstname: string;
    lastname: string;
    email: string;
    newsletter: boolean;
    schoolId?: School['id'];
    schooltype?: SchoolType;
    state: State;
    registrationSource: RegistrationSource;
    aboutMe: string;

    /* After registration, the user receives an email to verify their account.
       The user is redirected to this URL afterwards to continue with whatever they're registering for */
    redirectTo?: string;
}

export interface BecomeTuteeData {
    subjects: Subject[];
    gradeAsInt?: number;
    languages: Language[];
    learningGermanSince?: pupil_learninggermansince_enum;
}

export interface BecomeStatePupilData {
    teacherEmail: string;
    gradeAsInt?: number;
}

export async function registerPupil(data: RegisterPupilData, noEmail = false, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    if (!(await isEmailAvailable(data.email))) {
        throw new PrerequisiteError(`Email is already used by another account`);
    }

    if (data.schoolId != undefined) {
        const school = await prismaInstance.school.findUnique({ where: { id: data.schoolId } });
        if (!school) {
            throw new Error(`Invalid School ID '${data.schoolId}'`);
        }
        if (data.registrationSource === RegistrationSource.cooperation && !school.activeCooperation) {
            throw new Error(`Pupil cannot register with type COOPERATION as his School(${school.id}) is not a cooperation school`);
        }
    } else if (data.registrationSource === RegistrationSource.cooperation) {
        throw new Error('Pupil cannot register with type COOPERATION as they did not provide a cooperation school');
    }

    const verification = uuidv4();

    const pupil = await prismaInstance.pupil.create({
        data: {
            email: data.email.toLowerCase(),
            firstname: data.firstname,
            lastname: data.lastname,
            newsletter: data.newsletter,
            createdAt: new Date(),
            schooltype: data.schooltype,
            schoolId: data.schoolId,
            state: data.state,
            registrationSource: data.registrationSource,
            aboutMe: data.aboutMe,

            // Compatibility with legacy foreign keys
            wix_id: 'Z-' + uuidv4(),
            wix_creation_date: new Date(),

            // Every pupil can participate in courses
            isParticipant: true,
            // Every pupil is made a Tutee by registration.
            isPupil: true,

            // the authToken is used to verify the e-mail instead
            verification,

            // Pupils need to specifically request a match
            openMatchRequestCount: 0,

            notificationPreferences: data.newsletter ? ENABLED_NEWSLETTER : DISABLED_NEWSLETTER,
        },
    });

    if (!noEmail) {
        await Notification.actionTaken(userForPupil(pupil), 'pupil_registration_started', { redirectTo: data.redirectTo ?? '' });
    }

    await logTransaction('verificationRequets', userForPupil(pupil), {});

    return pupil;
}

export async function becomeTutee(pupil: Pupil, data: BecomeTuteeData, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    if (pupil.isPupil) {
        throw new RedundantError(`Pupil is already tutee`);
    }

    const updatedPupil = await prismaInstance.pupil.update({
        data: {
            isPupil: true,
            isParticipant: true,
            subjects: JSON.stringify(data.subjects.map(toPupilSubjectDatabaseFormat)),
            grade: `${data.gradeAsInt}. Klasse`,
            languages: data.languages ? { set: data.languages } : undefined,
            learningGermanSince: data.learningGermanSince,
        },
        where: { id: pupil.id },
    });

    return updatedPupil;
}

export async function becomeStatePupil(pupil: Pupil, data: BecomeStatePupilData) {
    if (!pupil.grade && !data.gradeAsInt) {
        throw new Error(`State Pupils must set their grade field`);
    }

    if (pupil.registrationSource !== RegistrationSource.cooperation) {
        throw new Error(`For pupils to become a state pupil, they must register with COOPERATION as registration source`);
    }

    const school = await prisma.school.findUnique({ where: { id: pupil.schoolId }, rejectOnNotFound: true });

    if (!data.teacherEmail.endsWith(school.emailDomain)) {
        throw new Error(`Invalid Teacher Email '${data.teacherEmail} as School Domain is '${school.emailDomain}'`);
    }

    const updatedPupil = await prisma.pupil.update({
        data: {
            teacherEmailAddress: data.teacherEmail,
            grade: data.gradeAsInt ? `${data.gradeAsInt}. Klasse` : undefined,
        },
        where: { id: pupil.id },
    });

    return updatedPupil;
}

export async function becomeParticipant(pupil: Pupil) {
    if (pupil.isParticipant) {
        throw new RedundantError(`Pupil is already a participant`);
    }

    const updatedPupil = await prisma.pupil.update({
        data: {
            isParticipant: true,
        },
        where: { id: pupil.id },
    });

    return updatedPupil;
}
