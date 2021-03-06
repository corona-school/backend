import { Stats as MatchingStats } from "corona-school-matching";
import { MatchPair } from "../../../../entity/Match";
import { MatchNotificationStatus, NotificationOptions } from "./notifications";

export type MatchMakingResult = {
    dryRun: boolean;
    notifications: NotificationOptions;
    createdMatches: MatchPair[] | null;
    failedNotifications: MatchNotificationStatus[] | null;
    matchingStats: MatchingStats;
};