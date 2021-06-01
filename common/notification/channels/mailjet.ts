import { Channel, Context, IDforNotificationChannel } from "../types";
import * as mailjetAPI from "node-mailjet";
import { mailjetSmtp } from "../../mails/config";
import { getLogger } from "log4js";

const sandbox = true;
const logger = getLogger();

export const mailjetChannel: Channel = {
    type: 'mailjet',
    send: (id: IDforNotificationChannel, context: Context) => {
        const message: mailjetAPI.Email.SendParamsMessage = {
            From: {
                Email: undefined
            },
            To: [
                {
                    Email: context.user.email
                }
            ],
            TemplateID: id,
            TemplateLanguage: true,
            Variables: context,
            Subject: context.subject,
            Attachments: context.attachments
        };

        // TODO: check what of the code below we need to implement as well (taken from /backend/common/mails/mailjet.ts)
        if (context.replyToAddress) {
            message.ReplyTo = {
                Email: context.replyToAddress
            };
        }
        //determine whether we have sandbox mode or not...
        let sandboxMode = sandbox;

        if (process.env.MAILJET_LIVE === "TEST") {
            message.Subject = `[TEST] ${message.Subject}`;
            logger.warn("Mailjet API sending in TEST/DEV MODE!");
        }
        //if mailjet is not set to live (via envs), always switch to sandbox, no matter what the sandbox-Parameter is set to
        else if (process.env.MAILJET_LIVE != "1") {
            logger.warn("Mailjet API not sending: MAILJET_LIVE not set");
            sandboxMode = true;
        }

        const mailjet = mailjetAPI.connect(mailjetSmtp.auth.user, mailjetSmtp.auth.pass);

        //send actual email
        let requestOptions: mailjetAPI.Email.SendParams = {
            SandboxMode: sandboxMode,
            Messages: [
                message
            ]
        };

        //log what is sent to mailjet, so we can better debug some problems with mails
        // logger.info(`Sending send-request to Mailjet: ${JSON.stringify(requestOptions)}`);

        return mailjet.post("send", { version: "v3.1" }).request(requestOptions);
    }
};