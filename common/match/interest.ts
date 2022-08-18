import type { Prisma, pupil as Pupil, student as Student, pupil_tutoring_interest_confirmation_request as InterestConfirmation } from "@prisma/client";
import * as Notification from "../notification";
import { v4 as uuid } from "uuid";
import { prisma } from "../prisma";
import { InterestConfirmationStatus } from "../entity/PupilTutoringInterestConfirmationRequest";
import assert from "assert";

const REMIND_AFTER = 7 /* days */;

export async function requestInterestConfirmation(pupil: Pupil) {
    const token = await uuid();
    
    const confirmationRequest = await prisma.pupil_tutoring_interest_confirmation_request.create({
        data: {
            token,
            pupilId: pupil.id,
            status: InterestConfirmationStatus.PENDING
        }
    });

    await Notification.actionTaken(confirmationRequest.pupil, "tutee_matching_confirm_interest", {
        uniqueId: `${confirmationRequest.id}`,
        confirmationURL: getConfirmationURL(confirmationRequest, true),
        refusalURL: getConfirmationURL(confirmationRequest, false)
    });
}

function getConfirmationURL(confirmation: InterestConfirmation, confirm: boolean) {
    assert(confirmation.status, InterestConfirmationStatus.PENDING);
    return `https://my.lern-fair.de/confirm?token=${confirmation.token}&confirmed=${confirm ? "true" : "false"}`;
}

export async function sendInterestConfirmationReminders() {
    const remindAt = new Date();
    remindAt.setDate(remindAt.getDate() - REMIND_AFTER);

    const toRemind = await prisma.pupil_tutoring_interest_confirmation_request.findMany({
        where: { status: InterestConfirmationStatus.PENDING, createdAt: { lte: remindAt }, reminderSentDate: null },
        select: { pupil: true }
    });

    for (const confirmationRequest of toRemind) {
        await Notification.actionTaken(confirmationRequest.pupil, "tutee_matching_confirm_interest_reminder", {
            uniqueId: `${confirmationRequest.id}`,
            confirmationURL: getConfirmationURL(confirmationRequest, true),
            refusalURL: getConfirmationURL(confirmationRequest, false)
        });
    
        await prisma.pupil_tutoring_interest_confirmation_request.update({
            data: { reminderSentDate: new Date() },
            where: { id: confirmationRequest.id }
        });
    }
}