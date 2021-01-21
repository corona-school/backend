import {DEFAULTSENDERS} from "./config";
import { mailjet as mailjetTemplates, TemplateMail } from "./templates";
import mailjet from "./mailjet";

import { getLogger } from "log4js";

const logger = getLogger();

async function sendTemplateMail(templateMail: TemplateMail, recipient: string, replyTo?: string) {
    if (templateMail.disabled) {
        logger.warn("Send Mail: The template is disabled – not sending that mail.");
    }

    try {
        const result = await mailjet.sendTemplate(
            templateMail.title,
            templateMail.sender,
            recipient,
            templateMail.id,
            templateMail.variables,
            templateMail.disabled,
            replyTo ? replyTo : undefined,
            templateMail.attachements?.map(a => {
                return {
                    ContentType: a.contentType,
                    Filename: a.filename,
                    Base64Content: a.base64Content
                };
            })
        );

        logger.info("E-Mail (type " + templateMail.type + ") was sent to " + recipient, JSON.stringify(result.body));
        return result;
    } catch (e) {
        logger.warn("Unable to send mail (type " + templateMail.type + ") to " + recipient + ": Status code " + e.statusCode);
        throw e;
    }
}

async function sendSMS(message : string, phone: string) {
    try {
        const result = await mailjet.sendSMS(message, phone, DEFAULTSENDERS.sms);

        logger.info("SMS was sent to " + phone, JSON.stringify(result.body));
        return result;
    } catch (e) {
        logger.warn("Unable to send SMS to " + phone + ": Status code " + e.statusCode + " " + e.response);
        throw e;
    }
}

async function sendTextEmail(
    subject: string,
    text: string,
    senderAddress: string,
    receiverAddress: string,
    senderName?: string,
    receiverName?: string,
    replyToAddress?: string,
    replyToName?: string
) {

    await mailjet.sendPure(subject, text, senderAddress, receiverAddress, senderName, receiverName, replyToAddress, replyToName);
}

export { mailjetTemplates, sendTemplateMail, sendSMS, sendTextEmail};
