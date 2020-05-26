import { getManager } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Student } from "../../../common/entity/Student";
import { getLogger } from "log4js";
import { Person } from "../../../common/entity/Person";
import { sendTemplateMail, mailjetTemplates } from "../../../common/mails";
import { Pupil } from "../../../common/entity/Pupil";
import { hashToken } from "../../../common/util/hashing";

const logger = getLogger();

export async function generateAuthTokenAndSendMail(maxAmount: number) {
    const entityManager = getManager();
    let students = await entityManager.find(Student, {
        verification: null,
        authToken: null,
        active: true,
    });

    if (students.length == 0) {
        logger.info("There are no students to generate authTokens for.");
    } else {
        let i;
        for (i = 0; i < students.length && i < maxAmount; i++) {
            const uuid = uuidv4();
            logger.debug(
                "Generated authToken " +
                    uuid +
                    " for " +
                    students[i].firstname +
                    " " +
                    students[i].lastname
            );
            students[i].authToken = hashToken(uuid);

            await entityManager.save(Student, students[i]);
            await sendLoginTokenMailAPI(students[i], uuid);
        }
        logger.info("Generated and sent tokens to " + i + " students");
    }

    let pupils = await entityManager.find(Pupil, {
        verification: null,
        authToken: null,
        active: true,
    });

    if (pupils.length == 0) {
        logger.info("There are no pupils to generate authTokens for.");
    } else {
        let i;
        for (i = 0; i < pupils.length && i < maxAmount; i++) {
            const uuid = uuidv4();
            logger.debug(
                "Generated authToken " +
                    uuid +
                    " for " +
                    pupils[i].firstname +
                    " " +
                    pupils[i].lastname
            );
            pupils[i].authToken = hashToken(uuid);

            await entityManager.save(Pupil, pupils[i]);
            await sendLoginTokenMailAPI(pupils[i], uuid);
        }
        logger.info("Generated and sent tokens to " + i + " students");
    }
}

export async function sendLoginTokenMailAPI(person: Person, authToken: string) {
    const dashboardURL =
        "https://dashboard.corona-school.de/login?token=" + authToken;
    try {
        const mail = mailjetTemplates.OLDAUTHTOKEN({
            dashboardURL: dashboardURL,
            personFirstname: person.firstname,
        });

        await sendTemplateMail(mail, person.email);
    } catch (e) {
        logger.error("Can't send (delayed) login token mail: ", e.message);
        logger.debug(e);
    }
}
