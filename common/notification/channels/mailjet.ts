import { Channel, Context, Notification } from '../types';
import * as mailjet from '../../mails/mailjetTypes';
import { mailjetSmtp } from '../../mails/config';
import { getLogger } from '../../../common/logger/logger';
import { assert } from 'console';
import { NotificationSender } from '../../entity/Notification';
import { AttachmentGroup } from '../../attachments';
import { isDev } from '../../util/environment';
import { User } from '../../user';
import { createSecretEmailToken } from '../../secret';
import moment from 'moment';

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

export const mailjetChannel: Channel = {
    type: 'email',
    async send(notification: Notification, to: User, context: Context, concreteID: number, attachments?: AttachmentGroup) {
        assert(notification.mailjetTemplateId !== undefined, "A Notification delivered via Mailjet must have a 'mailjetTemplateId'");

        const sender = senders[notification.sender ?? NotificationSender.SUPPORT];
        assert(sender !== undefined, 'Unknown sender');

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
        const authToken = await createSecretEmailToken(to, notification.description, moment().add(7, 'days'));

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

        let requestOptions: mailjet.SendParams = {
            SandboxMode: sandboxMode,
            Messages: [message],
        };

        logger.debug(`Sending Mail(${message.TemplateID}) to ${context.user.email} with options:`, requestOptions);
        logger.debug(`Variables: ${JSON.stringify({ ...context, attachmentGroup: attachments ? attachments.attachmentListHTML : '' })}`);

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

        logger.info(`Sent Mail(${message.TemplateID})`);
    },

    canSend: (notification: Notification, _user: User) => {
        return notification.mailjetTemplateId != null;
    },
};
