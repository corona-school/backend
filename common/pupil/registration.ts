import { prisma } from "../prisma";
import { isEmailAvailable } from "../user/email";
import { v4 as uuidv4 } from "uuid";
import { RegistrationSource } from "../entity/Person";
import { School } from "../entity/School";
import { State } from "../entity/State";
import VerificationRequestEvent from "../transactionlog/types/VerificationRequestEvent";
import { getTransactionLog } from "../transactionlog";
import * as Notification from "../notification";
import { TuteeJufoParticipationIndication } from "../jufo/participationIndication";
import { ProjectField } from "../jufo/projectFields";
import { pupil_projectfields_enum, pupil as Pupil, pupil_registrationsource_enum, pupil_languages_enum, pupil_learninggermansince_enum } from "@prisma/client";
import { Subject } from "../entity/Student";
import { Language } from "../daz/language";
import { Address } from "address-rfc2821";

interface RegisterPupilData {
    firstname: string;
    lastname: string;
    email: string;
    newsletter: boolean;
    schoolId: School["id"];
    state: State;
    registrationSource: RegistrationSource;

    /* After registration, the user receives an email to verify their account.
       The user is redirected to this URL afterwards to continue with whatever they're registering for */
    redirectTo?: string;
}

interface BecomeProjectCoacheeData {
    projectFields: ProjectField[];
    isJufoParticipant: TuteeJufoParticipationIndication;
    projectMemberCount: number;
}
interface BecomeTuteeData {
    subjects: Subject[];
    gradeAsInt?: number;
    languages: Language[];
    learningGermanSince?: pupil_learninggermansince_enum;
}

interface BecomeStatePupilData {
    teacherEmail: string;
    gradeAsInt?: number;
}


export async function registerPupil(data: RegisterPupilData) {
    if (!(await isEmailAvailable(data.email))) {
        throw new Error(`Email is already used by another account`);
    }

    const school = await prisma.school.findUnique({ where: { id: data.schoolId } });
    if (!school) {
        throw new Error(`Invalid School ID '${data.schoolId}'`);
    }

    if (data.registrationSource === RegistrationSource.COOPERATION && !school.activeCooperation) {
        throw new Error(`Pupil cannot register with type COOPERATION as his School(${school.id}) is not a cooperation school`);
    }

    const pupil = await prisma.pupil.create({
        data: {
            email: data.email.toLowerCase(),
            firstname: data.firstname,
            lastname: data.lastname,
            newsletter: data.newsletter,
            createdAt: new Date(),
            schooltype: school.schooltype,
            school: { connect: school },
            state: data.state,
            registrationSource: data.registrationSource as any,

            // Compatibility with legacy foreign keys
            wix_id: "Z-" + uuidv4(),
            wix_creation_date: new Date(),

            // Every pupil can participate in courses
            isParticipant: true,

            // the authToken is used to verify the e-mail instead
            verification: uuidv4()
        }
    });

    // TODO: Create a new E-Mail for registration
    // TODO: Send auth token with this
    await Notification.actionTaken(pupil, "pupil_registration_started", { redirectTo: data.redirectTo });
    await getTransactionLog().log(new VerificationRequestEvent(pupil));

    return pupil;
}

export async function becomeProjectCoachee(pupil: Pupil, data: BecomeProjectCoacheeData) {
    if (pupil.isProjectCoachee) {
        throw new Error(`Pupil is already project coachee`);
    }

    const { isJufoParticipant, projectFields, projectMemberCount } = data;

    const updatedPupil = await prisma.pupil.update({
        data: {
            isProjectCoachee: true,
            isJufoParticipant,
            projectFields: projectFields as pupil_projectfields_enum[],
            projectMemberCount
        },
        where: { id: pupil.id }
    });

    return updatedPupil;
}

export async function becomeTutee(pupil: Pupil, data: BecomeTuteeData) {
    const updatedPupil = await prisma.pupil.update({
        data: {
            isPupil: true,
            subjects: JSON.stringify(data.subjects),
            grade: `${data.gradeAsInt}. Klasse`,
            languages: data.languages ? { set: data.languages as pupil_languages_enum[] } : undefined,
            learningGermanSince: data.learningGermanSince
        },
        where: { id: pupil.id }
    });

    return updatedPupil;
}

export async function becomeStatePupil(pupil: Pupil, data: BecomeStatePupilData) {
    if (!pupil.grade && !data.gradeAsInt) {
        throw new Error(`State Pupils must set their grade field`);
    }

    if (pupil.registrationSource !== "" + RegistrationSource.COOPERATION) {
        throw new Error(`For pupils to become a state pupil, they must register with COOPERATION as registration source`);
    }

    const school = await prisma.school.findUnique({ where: { id: pupil.schoolId }, rejectOnNotFound: true });
    const teacherEmail = new Address(data.teacherEmail);

    if (school.emailDomain !== teacherEmail.host) {
        throw new Error(`Invalid Teacher Email '${data.teacherEmail} as School Domain is '${school.emailDomain}'`);
    }

    const updatedPupil = await prisma.pupil.update({
        data: {
            teacherEmailAddress: data.teacherEmail,
            grade: data.gradeAsInt ? `${data.gradeAsInt}. Klasse`: undefined
        },
        where: { id: pupil.id }
    });

    return updatedPupil;
}