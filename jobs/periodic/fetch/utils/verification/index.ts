import { randomBytes } from "crypto";
import { getLogger } from '../../../../../common/logger/logger';
import { sendTemplateMail, mailjetTemplates } from "../../../../../common/mails";
import { Person } from "../../../../../common/entity/Person";

const logger = getLogger();

export function generateToken(): string {
    // Create Verification Token
    let bytes = randomBytes(75);
    // Base 64 => Token will be 100 chars long
    let token = bytes
        .toString("base64")
        .replace(/\//g, "-")
        .replace(/\+/g, "_");
    logger.debug("Generated token: ", { token });
    return token;
}

export async function sendVerificationMail(person: Person, redirectTo?: string) {
    const verificationUrl = `https://my.lern-fair.de/verify?token=${person.verification}&redirectTo=${redirectTo ?? ""}`;

    console.log("verificationURL", verificationUrl);

    try {
        const mail = mailjetTemplates.VERIFICATION({
            confirmationURL: verificationUrl,
            personFirstname: person.firstname
        });
        await sendTemplateMail(mail, person.email);
    } catch (e) {
        logger.error("Can't send verification mail: ", e);
        logger.debug(e);
    }
}
