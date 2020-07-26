import { mailjetSmtp, DEFAULTSENDERS } from "./config";
import * as mailjetAPI from "node-mailjet";
import { getLogger } from "log4js";

const logger = getLogger();

async function sendMail(
    subject: string,
    senderAddress: string,
    receiverAddress: string,
    templateID: number,
    variables: object,
    sandbox: boolean = false,
    replyToAddress?: string
) {
    //determine whether we have sandbox mode or not...
    let sandboxMode = sandbox;

    //if mailjet is not set to live (via envs), always switch to sendbox, no matter what the sandbox-Parameter is set to
    if (process.env.MAILJET_LIVE != "1") {
        logger.warn("Mailjet API not sending: MAILJET_LIVE not set");
        sandboxMode = true;
    }

    const mailjet = mailjetAPI.connect(
        mailjetSmtp.auth.user,
        mailjetSmtp.auth.pass
    );

    //send actual email
    let requestOptions = {
        SandboxMode: sandboxMode,
        Messages: [
            {
                From: {
                    Email: senderAddress
                },
                To: [
                    {
                        Email: receiverAddress
                    }
                ],
                TemplateID: templateID,
                TemplateLanguage: true,
                Variables: variables,
                Subject: subject
            }
        ]
    };

    if (replyToAddress != undefined) {
        requestOptions.Messages[0]['ReplyTo'] = {
            Email: replyToAddress
        };
    }

    const request = mailjet.post("send", { version: "v3.1" }).request(requestOptions);

    return await request;
}

const ErrorCodes = {
    RATE_LIMIT: 429,
    NOT_AUTHORIZED: 401
};

export default {
    send: sendMail,
    ErrorCodes: ErrorCodes
};
