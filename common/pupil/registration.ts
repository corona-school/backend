import { prisma } from '../prisma';
import { isEmailAvailable } from '../user/email';
import { v4 as uuidv4 } from 'uuid';
import * as Notification from '../notification';
import {
    pupil_state_enum as State,
    pupil as Pupil,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_languages_enum as Language,
    pupil_learninggermansince_enum,
    school as School,
    pupil_schooltype_enum as SchoolType,
    Prisma,
    PrismaClient,
    pupil_email_owner_enum as PupilEmailOwner,
} from '@prisma/client';
import { logTransaction } from '../transactionlog/log';
import { PrerequisiteError, RedundantError } from '../util/error';
import { toPupilSubjectDatabaseFormat, Subject } from '../util/subjectsutils';
import { DISABLED_NEWSLETTER, ENABLED_NEWSLETTER } from '../notification/defaultPreferences';
import { userForPupil } from '../user';
import { CreateSchoolArgs, findOrCreateSchool } from '../school/create';
import { getLogger } from '../logger/logger';

export interface RegisterPupilData {
    firstname: string;
    lastname: string;
    emailOwner: PupilEmailOwner;
    email: string;
    newsletter: boolean;
    school?: CreateSchoolArgs;
    registrationSource: RegistrationSource;
    aboutMe: string;

    /* After registration, the user receives an email to verify their account.
       The user is redirected to this URL afterwards to continue with whatever they're registering for */
    redirectTo?: string;
    referredById?: string;
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

const logger = getLogger('pupilRegistration');

export async function registerPupil(data: RegisterPupilData, noEmail = false, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    if (!(await isEmailAvailable(data.email))) {
        throw new PrerequisiteError(`Email is already used by another account`);
    }

    let school: School;
    try {
        school = await findOrCreateSchool(data.school);
    } catch (error) {
        logger.error('School was not found or could not be created', error);
    }

    const pupil = await prismaInstance.pupil.create({
        data: {
            emailOwner: data.emailOwner,
            email: data.email.toLowerCase(),
            firstname: data.firstname,
            lastname: data.lastname,
            newsletter: data.newsletter,
            createdAt: new Date(),
            schooltype: data.school?.schooltype,
            state: data.school?.state,
            registrationSource: data.registrationSource,
            schoolId: school?.id,
            aboutMe: data.aboutMe,

            // Compatibility with legacy foreign keys
            wix_id: 'Z-' + uuidv4(),
            wix_creation_date: new Date(),

            // Every pupil can participate in courses
            isParticipant: true,
            // Every pupil is made a Tutee by registration.
            isPupil: true,

            // the ID of the referrer (type + id)
            referredById: data.referredById,

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

// TODO: Remove deprecated feature
export async function becomeStatePupil(pupil: Pupil, data: BecomeStatePupilData) {
    if (!pupil.grade && !data.gradeAsInt) {
        throw new Error(`State Pupils must set their grade field`);
    }

    if (pupil.registrationSource !== RegistrationSource.cooperation) {
        throw new Error(`For pupils to become a state pupil, they must register with COOPERATION as registration source`);
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
