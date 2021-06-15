import { Person } from "common/entity/Person";
import { Pupil } from "../entity/Pupil";
import { Student } from "../entity/Student";

export type NotificationID = string; // either our own or we reuse them from Mailjet. Maybe we can structure them a bit better
export type CategoryID = string; // categories as means to opt out from a certain category of mails
// An action is something the user does. One action might trigger / cancel multiple notifications
export type ActionID = string;
export type Email = `${string}@${string}.${string}`; 




export interface Reminder {
    cancelledOnAction: ActionID[];
    delay: number;
    interval: number;
}

export{ sentNotification, notification } from '.prisma/client'; 



// Currently the templates have a lot of repeating fields, such as "userFirstName"
// Maybe we can generalize into a context that is partially available for each Notification
// Mailjet does support objects in variables, so just dumping the Context to Mailjet will work  
// TODO: How to migrate there from current templates? Copy & Paste in Mailjet?
export interface NotificationContext {
    student?: Student; // set if the pupil is notified, and a certain student is relevant, this property is set
    pupil?: Pupil; // if the pupil is notified and a certain student is somehow relevant, this property is set
    replyToAddress? : Email; 
    // I'm not sure if it is useful to maintain the variable shape in the backend
    //  as a missmatch with the Mailjet template won't be detected anyways. I guess we can just allow any further props:
    [key: string]: any;
}

// The user is always known, also for notifications sent by Actions / Reminders
export interface Context extends NotificationContext {
    user: Person;
    title: string;
    
}

export interface Channel {
    type: "mailjet";
    send(id: string, context: Context): Promise<any>;
    canSend(id: NotificationID): boolean; 
}

export namespace Notification { // supports both SMS & E-Mail
    // notifications: NotificationTemplate[];
    // reminders: Reminder[];
    // channels: Channel[];

    
}