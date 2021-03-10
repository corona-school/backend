import { Match } from "../../../../entity/Match";
import { Pupil } from "../../../../entity/Pupil";
import { Student } from "../../../../entity/Student";

export enum NotificationType {
    email = "email",
    sms = "sms"
}

export type NotificationOptions = {
    [NotificationType.email]: boolean;
    [NotificationType.sms]: boolean;
};

export type MatchNotificationError = {
    affectedTutor?: Student; // is set, if those tutor hasn't received the notification
    affectedTutee?: Pupil; //is set, if those tutee hasn't received the notification
    underlyingError: any; //error, that lead to the notifications failure
};
export class MatchNotificationStatus {
    match: Match;
    type: NotificationType;
    readonly error?: MatchNotificationError;
    get isOK(): boolean {
        return !this.error;
    }

    //constructs success status
    constructor(match: Match, type: NotificationType, error?: MatchNotificationError) {
        this.match = match;
        this.type = type;
        this.error = error;
    }
}