import {EntityManager} from "typeorm";
import {sendPendingCoCReminders} from "./reminder";

export default async function sendCoCReminders(manager: EntityManager) {
    const now = new Date();
    await sendPendingCoCReminders(manager, now);
}