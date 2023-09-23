import { Channel, Context, Notification, NotificationSender } from '../types';
import * as mailjet from '../../mails/mailjetTypes';
import { mailjetSmtp } from '../../mails/config';
import { getLogger } from '../../../common/logger/logger';
import * as assert from 'assert';
import { AttachmentGroup } from '../../attachments';
import { isDev } from '../../util/environment';
import { User } from '../../user';
// eslint-disable-next-line import/no-cycle
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

        // For campaigns, support notifications with a custom mailjet template for each campaign
        // This feature is restricted to Notifications that provide a sample_context (= Campaign Notifications),
        //  which specifies the mailjet template id
        let TemplateID = notification.mailjetTemplateId;
        if (context.overrideMailjetTemplateID) {
            assert.ok(context.campaign, 'Concrete Notification must be part of a campaign to override the mailjet template');
            assert.ok(notification.sample_context, 'Concrete Notification must belong to a Campaign Notification to override the mailjet template');
            assert.ok(
                (notification.sample_context as any).overrideMailjetTemplateID,
                'Concrete Notification must belong to a Campaign Notification that allows overriding the mailjet template to override the mailjet template'
            );

            TemplateID = parseInt(context.overrideMailjetTemplateID, 10);
        }

        const message: any = {
            // c.f. https://dev.mailjet.com/email/reference/send-emails#v3_1_post_send
            From: sender,
            To: [
                {
                    Email: receiverEmail,
                },
            ],
            TemplateID,
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

        const requestOptions: mailjet.SendParams = {
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
