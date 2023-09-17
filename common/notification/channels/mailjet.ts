import { Channel, Context, Notification, NotificationSender } from '../types';
import { getLogger } from '../../../common/logger/logger';
import * as assert from 'assert';
import { AttachmentGroup } from '../../attachments';
import { isDev } from '../../util/environment';
import { User } from '../../user';
// eslint-disable-next-line import/no-cycle
import { createSecretEmailToken } from '../../secret';
import moment from 'moment';

// ------------ Mailjet Interface -------------------------------

export interface SendParams {
    Messages: SendParamsMessage[];
    SandboxMode?: boolean;
}

export interface SendParamsMessage {
    From: {
        Email: string;
        Name?: string;
    };
    Sender?: {
        Email: string;
        Name?: string;
    };
    To: SendParamsRecipient[];
    Cc?: SendParamsRecipient[];
    Bcc?: SendParamsRecipient[];
    ReplyTo?: SendParamsRecipient;
    Variables?: object;
    TemplateID?: number;
    TemplateLanguage?: boolean;
    Subject: string;
    TextPart?: string;
    HTMLPart?: string;
    MonitoringCategory?: string;
    URLTags?: string;
    CustomCampaign?: string;
    DeduplicateCampaign?: boolean;
    EventPayload?: string;
    CustomID?: string;
    Headers?: object;
    Attachments?: Attachment[];
    InlinedAttachments?: InlinedAttachment[];
}

interface SendParamsRecipient {
    Email: string;
    Name?: string;
}

interface Attachment {
    ContentType: string;
    Filename: string;
    Base64Content: string;
}

interface InlinedAttachment extends Attachment {
    ContentID: string;
}

// ------------- Config -----------------------------------------

const mailjetSmtp = {
    host: 'in-v3.mailjet.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILJET_USER,
        pass: process.env.MAILJET_PASSWORD,
    },
    tls: {
        ciphers: 'SSLv3',
    },
};

export const DEFAULTSENDERS = {
    noreply: '"Lern-Fair Team" <noreply@lern-fair.de>',
    support: '"Lern-Fair Team" <support@lern-fair.de>',
};

const logger = getLogger();
const mailAuth = Buffer.from(`${mailjetSmtp.auth.user}:${mailjetSmtp.auth.pass}`).toString('base64');

const senders: { [sender in NotificationSender]: { Name: string; Email: string } } = {
    [NotificationSender.SUPPORT]: {
        Email: 'support@lern-fair.de',
        Name: 'Lern-Fair Team',
    },
    [NotificationSender.CERTIFICATE_OF_CONDUCT]: {
        Email: 'fz@lern-fair.de',
        Name: 'Lern-Fair Führungszeugnisse',
    },
};

// ------------------- Send -------------------------------------

async function sendMessage(message: SendParamsMessage) {
    let sandboxMode = false;

    if (process.env.MAILJET_LIVE === 'TEST') {
        message.Subject = `TESTEMAIL`;
        logger.warn(`Mail is in Test Mode`);
    } else if (process.env.MAILJET_LIVE != '1') {
        logger.warn(`Mail is in Sandbox Mode`);
        sandboxMode = true;
    }

    if (!mailjetSmtp.auth.user || !mailjetSmtp.auth.pass) {
        throw new Error(`Missing credentials for Mailjet API! Are MAILJET_USER and MAILJET_PASSWORD passed as env variables?`);
    }

    const requestOptions: SendParams = {
        SandboxMode: sandboxMode,
        Messages: [message],
    };

    const body = await fetch('https://api.mailjet.com/v3.1/send', {
        body: JSON.stringify(requestOptions),
        headers: {
            Authorization: `Basic ${mailAuth}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then((res) => res.json());

    if (!body.Messages || body.Messages.length !== 1) {
        throw new Error(`Mailjet API responded with invalid body`);
    }

    const result = body.Messages[0];

    if (result.Status !== 'success') {
        const errorMessages = (result as any).Errors.map((error) => error.ErrorMessage).join(', ');

        throw new Error(`Mailjet Message Delivery failed: ${errorMessages}`);
    }
}

export async function sendMail(
    subject: string,
    text: string,
    senderAddress: string,
    receiverAddress: string,
    senderName?: string,
    receiverName?: string,
    replyToAddress?: string,
    replyToName?: string
) {
    // construct mailjet API message
    const message: SendParamsMessage = {
        From: {
            Email: senderAddress,
            Name: senderName,
        },
        To: [
            {
                Email: receiverAddress,
                Name: receiverName,
            },
        ],
        Subject: subject,
        TextPart: text,
    };

    if (replyToAddress) {
        message.ReplyTo = {
            Email: replyToAddress,
            Name: replyToName,
        };
    }

    return await sendMessage(message);
}

// ---------------- Notification System Channel --------------------

export const mailjetChannel: Channel = {
    type: 'email',
    async send(notification: Notification, to: User, context: Context, concreteID: number, attachments?: AttachmentGroup) {
        assert.ok(notification.mailjetTemplateId !== undefined, "A Notification delivered via Mailjet must have a 'mailjetTemplateId'");

        const sender = senders[notification.sender ?? NotificationSender.SUPPORT];
        assert.ok(sender !== undefined, 'Unknown sender');

        let receiverEmail = to.email;
        if (context.overrideReceiverEmail) {
            receiverEmail = context.overrideReceiverEmail;
            logger.info(`When sending out ConcreteNotification(${concreteID}) the Receiver was overriden to '${receiverEmail}'`);
        }

        // c.f. https://dev.mailjet.com/email/guides/send-campaigns-with-sendapi/
        // This groups statistics in the Mailjet UI
        let CustomCampaign: string | undefined = undefined;

        if (!isDev) {
            // For campaigns, we want dedicated statistics even though they share the same template
            // For transactional mails, all are collected in the same campaign
            CustomCampaign = context.campaign ?? `Backend Notification ${notification.id}`;
        }

        // Create a new login token
        const authToken = await createSecretEmailToken(to, undefined, moment().add(7, 'days'));

        const message: any = {
            // c.f. https://dev.mailjet.com/email/reference/send-emails#v3_1_post_send
            From: sender,
            To: [
                {
                    Email: receiverEmail,
                },
            ],
            TemplateID: notification.mailjetTemplateId,
            TemplateLanguage: true,
            Variables: { ...context, attachmentGroup: attachments ? attachments.attachmentListHTML : '', authToken },
            Attachments: context.attachments,
            CustomID: `${concreteID}`,
            TemplateErrorReporting: {
                Email: 'backend@lern-fair.de',
            },
            CustomCampaign,
        };

        if (context.replyToAddress) {
            message.ReplyTo = {
                Email: context.replyToAddress,
            };
        }

        logger.debug(`Sending Mail(${message.TemplateID}) to ${context.user.email} with message`, message);
        logger.debug(`Variables: ${JSON.stringify({ ...context, attachmentGroup: attachments ? attachments.attachmentListHTML : '' })}`);

        await sendMessage(message);

        logger.info(`Sent Mail(${message.TemplateID})`);
    },

    canSend: (notification: Notification, _user: User) => {
        return notification.mailjetTemplateId != null;
    },
};
