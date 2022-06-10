import { Channel, Context, Notification } from "../types";
import * as mailjetAPI from "node-mailjet";
import { mailjetSmtp } from "../../mails/config";
import { getLogger } from "log4js";
import { Person } from "../../entity/Person";
import { assert } from "console";
import { NotificationSender } from "../../entity/Notification";
import {AttachmentGroup} from "../../attachments";

const logger = getLogger();

const senderEmails: { [sender in NotificationSender]: string } = {
    [NotificationSender.SUPPORT]: "support@lern-fair.de",
    [NotificationSender.CERTIFICATE_OF_CONDUCT]: "fz@lern-fair.de"
};

export const mailjetChannel: Channel = {
    type: 'mailjet',
    async send(notification: Notification, to: Person, context: Context, concreteID: number, attachments?: AttachmentGroup) {
        assert(notification.mailjetTemplateId !== undefined, "A Notification delivered via Mailjet must have a 'mailjetTemplateId'");

        const senderEmail = senderEmails[notification.sender ?? NotificationSender.SUPPORT];
        assert(senderEmail !== undefined, "Unknown sender emails");

        const message: any = { // unfortunately the Typescript types do not match the documentation https://dev.mailjet.com/email/reference/send-emails#v3_1_post_send
            From: {
                Email: senderEmail
            },
            To: [
                {
                    Email: to.email
                }
            ],
            TemplateID: notification.mailjetTemplateId,
            TemplateLanguage: true,
            Variables: {...context, attachmentGroup: attachments ? attachments.attachmentListHTML : ""},
            Attachments: context.attachments,
            CustomID: `${concreteID}`,
            TemplateErrorReporting: {
                Email: "backend@lern-fair.de"
            }
        };

        if (context.replyToAddress) {
            message.ReplyTo = {
                Email: context.replyToAddress
            };
        }

        let sandboxMode = false;

        if (process.env.MAILJET_LIVE === "TEST") {
            message.Subject = `TESTEMAIL`;
            logger.warn(`Mail is in Test Mode`);
        } else if (process.env.MAILJET_LIVE != "1") {
            logger.warn(`Mail is in Sandbox Mode`);
            sandboxMode = true;
        }

        if (!mailjetSmtp.auth.user || !mailjetSmtp.auth.pass) {
            throw new Error(`Missing credentials for Mailjet API! Are MAILJET_USER and MAILJET_PASSWORD passed as env variables?`);
        }

        const mailjet = mailjetAPI.connect(mailjetSmtp.auth.user, mailjetSmtp.auth.pass);

        let requestOptions: mailjetAPI.Email.SendParams = {
            SandboxMode: sandboxMode,
            Messages: [
                message
            ]
        };

        logger.debug(`Sending Mail(${message.TemplateID}) to ${context.user.email} with options:`, requestOptions);

        const { body } = await mailjet.post("send", { version: "v3.1" }).request(requestOptions);

        if (!body.Messages || body.Messages.length !== 1) {
            throw new Error(`Mailjet API responded with invalid body`);
        }

        const result = body.Messages[0];

        if (result.Status !== "success") {
            const errorMessages = (result as any).Errors.map(error => error.ErrorMessage).join(", ");

            throw new Error(`Mailjet Message Delivery failed: ${errorMessages}`);
        }

        logger.info(`Sent Mail(${message.TemplateID})`);
    },

    canSend: (notification: Notification) => {
        return notification.mailjetTemplateId !== undefined;
    }
};
