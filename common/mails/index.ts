import * as nodemailer from "nodemailer";
import { mailjetSmtp } from "./config";
import { mailjet as mailjetTemplates, TemplateMail } from "./templates";
import mailjet from "./mailjet";

import * as fs from "fs";
import { getLogger } from "log4js";

const logger = getLogger();

function formatDate(d: Date): string {
    return [
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(),
        d.getUTCSeconds()
    ].join("-");
}

function saveMail(recipient: string, subject: string, sender: string, text: string, html: string, saveHTMLseparate: boolean = true) {
    const t = `
    FROM: ${sender}
    TO: ${recipient} \n\n\n
    SUBJECT: ${subject} \n\n\n
    ------------------HTML-------------------\n
    ${saveHTMLseparate ? "STORED IN SEPARATE FILE" : html}
    ------------------TEXT-------------------
    ${text}
    `;

    try {
        const mailStorage = typeof process.env.TEST_MAIL_STORAGE != "undefined" ? process.env.TEST_MAIL_STORAGE : "mailstore";
        const baseFileName = `${mailStorage}/sent/${recipient}-${formatDate(new Date())}`;

        fs.writeFileSync(`${baseFileName}.txt`, t);

        if (saveHTMLseparate) {
            fs.writeFileSync(`${baseFileName}-content.html`, html);
        }
    } catch (e) {
        console.warn("Can't save mail to filesystem: ", e.message);
        console.debug(e);
    }
}

async function sendMailTo(recipient: string, subject: string, text: string, html: string, sender: string, debug: boolean = true) {
    if (debug) {
        //just save the mail to the log directory
        saveMail(recipient, subject, sender, text, html);
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(mailjetSmtp);

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: sender, // sender address
        to: recipient, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    });

    logger.info(`Message sent to ${recipient}`);
}

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
            replyTo ? replyTo : undefined
        );

        logger.info("E-Mail (type " + templateMail.type + ") was sent to " + recipient, JSON.stringify(result.body));
        return result;
    } catch (e) {
        logger.warn("Unable to send mail (type " + templateMail.type + ") to " + recipient + ": Status code " + e.statusCode);
        throw e;
    }
}

export { mailjetTemplates, sendTemplateMail, sendMailTo };
