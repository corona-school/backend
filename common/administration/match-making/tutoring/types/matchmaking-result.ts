import { MatchPair } from "../../../../entity/Match";
import { MatchingAlgoStats } from "../matching/types";
import { MatchNotificationStatus, NotificationOptions } from "./notifications";

export type MatchMakingResult = {
    dryRun: boolean;
    notifications: NotificationOptions;
    createdMatches: MatchPair[] | null;
    failedNotifications: MatchNotificationStatus[] | null;
    matchingStats: MatchingAlgoStats;
};