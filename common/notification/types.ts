import { Pupil } from "../entity/Pupil";
import { Student } from "../entity/Student";

export type NotificationID = string; // either our own or we reuse them from Mailjet. Maybe we can structure them a bit better
export type CategoryID = string; // categories as means to opt out from a certain category of mails
// An action is something the user does. One action might trigger / cancel multiple notifications
export type ActionID = string;
export type IDforNotificationChannel = number;

export type NotificationChannel = {
    id: IDforNotificationChannel; // unique ID for that notification for that channel
    type: "mailjet" | "sms" | "whatsapp" | "signal";
}

export interface Reminder {
    cancelledOnAction: ActionID[];
    delay: number;
    interval: number;
}

export type NotificationTemplate = (Reminder | {}) & {
    id: NotificationID;
    // eventually not the user itself is notified, but their parents, teacher, etc. ...
    recipient?: "parent" | "teacher" | ...;
    // When one of these actions are taken by the user, the notification is sent
    onActions: ActionID[];

    via: NotificationChannel[];

    // allow users to opt out per category:
    category?: CategoryID;

    // TODO: Do we check the context? 
    // context?: ContextValidator;
    // Create a reminder for this notification, it is preferred to use an action instead that is used in both the initial email and the reminder
    // TODO: is this necessary
    reminder?: NotificationID;
}



// Currently the templates have a lot of repeating fields, such as "userFirstName"
// Maybe we can generalize into a context that is partially available for each Notification
// Mailjet does support objects in variables, so just dumping the Context to Mailjet will work  
// TODO: How to migrate there from current templates? Copy & Paste in Mailjet?
export interface NotificationContext {
    student?: Student; // set if the pupil is notified, and a certain student is relevant, this property is set
    pupil?: Pupil; // if the pupil is notified and a certain student is somehow relevant, this property is set
    // I'm not sure if it is useful to maintain the variable shape in the backend
    //  as a missmatch with the Mailjet template won't be detected anyways. I guess we can just allow any further props:
    [key: string]: any;
}

// The user is always known, also for notifications sent by Actions / Reminders
export interface Context extends NotificationContext {
    user: Pupil | Student;
    title: string;
}

export interface Channel {
    type: "mailjet";
    send(id: IDforNotificationChannel, context: Context): Promise<any>;
}

export namespace Notification { // supports both SMS & E-Mail
    // notifications: NotificationTemplate[];
    // reminders: Reminder[];
    // channels: Channel[];

    
}