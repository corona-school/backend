import { Stats } from "corona-school-matching";
import { NotificationOptions, NotificationType } from "../../../../common/administration/match-making/tutoring/types/notifications";
import { Subject } from "../../../../common/entity/Student";

export type ApiSubject = Subject;
export class ApiMatch {
    helper: {
        uuid: string;
        email: string;
        subjects: ApiSubject[];
    };
    helpee: {
        uuid: string;
        email: string;
        subjects: ApiSubject[];
        grade: number;
    };
}

export type ApiUsedNotificationOptions = NotificationOptions;
export type ApiNotificationType = NotificationType;
export class ApiFailedNotification {
    type: ApiNotificationType;
    matchUUID: string;
    errorMessage?: string;
    affectedTutorEmail?: string;
    affectedTuteeEmail?: string;
}

export type ApiMatchingStats = Stats;
export class ApiMatchMakingResult {
    wasDryRun: boolean;
    matches: ApiMatch[];
    stats: ApiMatchingStats;
    notificationChannelsUsed: ApiUsedNotificationOptions;
    failedNotifications?: ApiFailedNotification[];
}