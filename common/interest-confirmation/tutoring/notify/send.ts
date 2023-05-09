import { EntityManager } from 'typeorm';
import { PupilTutoringInterestConfirmationRequest } from '../../../entity/PupilTutoringInterestConfirmationRequest';
import { mailjetTemplates, sendTemplateMail } from '../../../mails';
import { getTransactionLog } from '../../../transactionlog';
import PupilInterestConfirmationRequestReminderSentEvent from '../../../transactionlog/types/PupilInterestConfirmationRequestReminderSentEvent';
import PupilInterestConfirmationRequestSentEvent from '../../../transactionlog/types/PupilInterestConfirmationRequestSentEvent';
import * as Notification from '../../../../common/notification';
import { createSecretEmailToken } from '../../..//secret';
import { userForPupil } from '../../../user';
import moment from 'moment';

async function createMailFromTemplate(
    template: typeof mailjetTemplates.PUPILMATCHREQUESTCONFIRMATION | typeof mailjetTemplates.PUPILMATCHREQUESTCONFIRMATIONREMINDER,
    confirmationRequest: PupilTutoringInterestConfirmationRequest
) {
    const authToken = await createSecretEmailToken(userForPupil(confirmationRequest.pupil), undefined, moment().add(7, 'days'));
    return template({
        firstName: confirmationRequest.pupil.firstname,
        authToken,
        confirmationURL: confirmationRequest.confirmationURL(),
        refusalURL: confirmationRequest.refusalURL(),
    });
}

export async function sendTutoringConfirmationRequest(confirmationRequest: PupilTutoringInterestConfirmationRequest, manager: EntityManager) {
    // send email
    const mail = await createMailFromTemplate(mailjetTemplates.PUPILMATCHREQUESTCONFIRMATION, confirmationRequest);
    await sendTemplateMail(mail, confirmationRequest.pupil.email);
    await Notification.actionTaken(confirmationRequest.pupil, 'tutee_matching_confirm_interest', {
        uniqueId: `${confirmationRequest.id}`,
        confirmationURL: confirmationRequest.confirmationURL(),
        refusalURL: confirmationRequest.refusalURL(),
    });

    // transaction log
    const transactionLog = getTransactionLog();
    await transactionLog.log(new PupilInterestConfirmationRequestSentEvent(confirmationRequest));
}

export async function sendTutoringConfirmationRequestReminder(confirmationRequest: PupilTutoringInterestConfirmationRequest, manager: EntityManager) {
    // send email
    const mail = await createMailFromTemplate(mailjetTemplates.PUPILMATCHREQUESTCONFIRMATIONREMINDER, confirmationRequest);
    await sendTemplateMail(mail, confirmationRequest.pupil.email);

    // transaction log
    const transactionLog = getTransactionLog();
    await transactionLog.log(new PupilInterestConfirmationRequestReminderSentEvent(confirmationRequest));
}

export async function sendTutoringConfirmationRequests(confirmationRequests: PupilTutoringInterestConfirmationRequest[], manager: EntityManager) {
    return await Promise.all(confirmationRequests.map((r) => sendTutoringConfirmationRequest(r, manager)));
}
export async function sendTutoringConfirmationRequestReminders(confirmationRequests: PupilTutoringInterestConfirmationRequest[], manager: EntityManager) {
    return await Promise.all(confirmationRequests.map((r) => sendTutoringConfirmationRequestReminder(r, manager)));
}
