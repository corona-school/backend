import { Person } from "../../../common/entity/Person";
import * as Express from "express";
import * as Notification from "../../../common/notification";
export const notificationRoute = Express.Router();

/* Internal API endpoint for debugging / manual testing purposes */
export async function triggerActionHandler(req: Express.Request, res: Express.Response) {
    if (process.env.NODE_ENV !== "dev") {
        return res.status(404).send("This endpoint is only accessible in development environments");
    }

    const user = res.locals.user as Person;
    const { actionId, context } = req.body;

    if (typeof actionId !== "string" || typeof context !== "object") {
        return res.status(400).send("Missing actionId or context in body");
    }

    try {
        await Notification.actionTaken(user, actionId, context);
        return res.status(200).send("OK - Action was triggered, See logs for details");
    } catch (error) {
        return res.status(500).send(`The following error occured:\n\n${error}`);
    }
}

/* Internal API endpoint for debugging / manual testing purposes */
export async function checkReminders(req: Express.Request, res: Express.Response) {
    if (process.env.NODE_ENV !== "dev") {
        return res.status(404).send("This endpoint is only accessible in development environments");
    }

    try {
        await Notification.checkReminders();
        return res.send("OK - Checked reminders, see logs for details");
    } catch (error) {
        return res.status(500).send(`The following error occured:\n\n${error}`);
    }
}