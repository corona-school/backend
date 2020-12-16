import {randomBytes} from "crypto";
import {getLogger} from "log4js";
import {sendTemplateMail, mailjetTemplates, sendSMS} from "../../../../../common/mails";
import {Person} from "../../../../../common/entity/Person";

const logger = getLogger();

export function generateToken(): string {
    // Create Verification Token
    let bytes = randomBytes(75);
    // Base 64 => Token will be 100 chars long
    let token = bytes
        .toString("base64")
        .replace(/\//g, "-")
        .replace(/\+/g, "_");
    logger.debug("Generated token: ", token);
    return token;
}

export function generateCode(): string {
    // Range of the code
    let min = 10000;
    let max = 99999;

    let code = Math.floor(Math.random() * (max - min + 1) + min);
    logger.debug("Generated code: ", code);
    return String(code);
}

export async function sendVerificationMail(person: Person, redirectTo?: string) {
    const verificationUrl = `https://my.corona-school.de/verify?token=${person.verification}&redirectTo=${redirectTo ?? ""}`;

    console.log("verificationURL", verificationUrl);

    try {
        const mail = mailjetTemplates.VERIFICATION({
            confirmationURL: verificationUrl,
            personFirstname: person.firstname
        });
        await sendTemplateMail(mail, person.email);
    } catch (e) {
        logger.error("Can't send verification mail: ", e.message);
        logger.debug(e);
    }
}

export async function sendVerificationSMS(phone : string, name : string, code : string) {
    if (phone == null) {
        console.log('Can\'t send verification SMS because phone number is null');
    } else {
        console.log("SMS verification code", code);

        try {
            let message = "Hallo " + name + "! Dein Bestätigungscode lautet: " + code;
            await sendSMS(message, phone);
        } catch (e) {
            logger.error("Can't send verification SMS: ", e.message);
            logger.debug(e);
        }
    }
}

