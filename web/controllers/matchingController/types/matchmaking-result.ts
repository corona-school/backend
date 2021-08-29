import { Stats } from "corona-school-matching";
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

export class ApiFailedNotification {
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
    failedNotifications?: ApiFailedNotification[];
}