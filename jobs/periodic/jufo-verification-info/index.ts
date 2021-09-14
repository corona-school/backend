import { EntityManager } from "typeorm";
import { getLogger } from "log4js";
import { Student } from "../../../common/entity/Student";
import { createObjectCsvStringifier } from "csv-writer";
import { getOfficialProjectFieldName } from "../../../common/jufo/projectFields";
import { mailjetTemplates, sendTemplateMail } from "../../../common/mails";
import { JufoVerificationTransmission } from "../../../common/entity/JufoVerificationTransmission";
import { TutorJufoParticipationIndication } from "../../../common/jufo/participationIndication";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    //remind all
    await collectAndSend(manager);
}

async function collectCoachesWithPendingJufoVerification(manager: EntityManager): Promise<Student[]> {
    return (await manager.find(Student, {
        relations: ["jufoVerificationTransmission"],
        where: {
            active: true,
            verification: null,
            isProjectCoach: true,
            isStudent: false,
            isUniversityStudent: false,
            wasJufoParticipant: TutorJufoParticipationIndication.YES,
            hasJufoCertificate: false
        }
    })).filter(s => !s.jufoVerificationTransmission); //filter here, because nested "where" do not work properly -> https://github.com/typeorm/typeorm/issues/2707
}

async function convertCoachArrayToOutputFormat(coaches: Student[]) {
    const transformedCoachesPromises = coaches.map(async c => {
        const projectFieldInfo = await c.getProjectFields();
        const projectInfoString = projectFieldInfo.map(pf => `${getOfficialProjectFieldName(pf.name)}${(pf.min && pf.max && `(${pf.min}-${pf.max})`) || ""}`).join(", ");
        return {
            uuid: (await c.jufoVerificationTransmission).uuid,
            firstName: c.firstname,
            lastName: c.lastname,
            email: c.email,
            pastParticipationInfo: c.jufoPastParticipationInfo,
            projectFields: projectInfoString,
            registrationDate: c.wix_creation_date
        };
    });
    return await Promise.all(transformedCoachesPromises);
}

async function csvStringFromCoaches(manager: EntityManager, coaches: Student[]) {
    const objectsToWrite = await convertCoachArrayToOutputFormat(coaches);

    const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: "uuid", title: "UUID" },
            { id: "firstName", title: "first name" },
            { id: "lastName", title: "last name" },
            { id: "email", title: "email address" },
            { id: "pastParticipationInfo", title: "past participation info" },
            { id: "projectFields", title: "project fields" },
            { id: "registrationDate", title: "registration date" }
        ]
    });

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(objectsToWrite);
}


const JUFO_VERIFICATION_UPDATE_MAIL_RECEIVER = process.env.ENV === "dev"
    ? "test+projectcoaching@lern-fair.de"
    : "projektcoaching@lern-fair.de";

async function sendJufoVerificationUpdateWithCoaches(manager: EntityManager, coaches: Student[]) {
    //create CSV from coaches
    const csv = await csvStringFromCoaches(manager, coaches);

    //send out jufo verification update mail with csv
    const base64CSV = Buffer.from(csv).toString("base64");
    const mail = mailjetTemplates.JUFOALUMNITOVERIFY(base64CSV);

    await sendTemplateMail(mail, JUFO_VERIFICATION_UPDATE_MAIL_RECEIVER);
}

async function storeCoachesAsTransmittedTheirAlumniVerificationRequest(manager: EntityManager, coaches: Student[]) {
    coaches.forEach(c => { //create a JufoVerificationTransmission for all coaches
        const jvt = new JufoVerificationTransmission();
        c.jufoVerificationTransmission = jvt;
    });
    await manager.save(coaches);
}

async function collectAndSend(manager: EntityManager) {
    //Collect
    const coachesWithPendingVerification = await collectCoachesWithPendingJufoVerification(manager);

    if (coachesWithPendingVerification.length === 0) {
        logger.info("Not sending any list with coaches today, because no one has a pending verification for Jugend forscht");
        return;
    }

    //store them all as transmitted to jufo
    await storeCoachesAsTransmittedTheirAlumniVerificationRequest(manager, coachesWithPendingVerification);

    //send out the email
    await sendJufoVerificationUpdateWithCoaches(manager, coachesWithPendingVerification);

    //(TODO: probably improve this by also deleting the JufoVerificationTransmission object in case of an error when sending the mail...)
}