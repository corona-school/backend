import { MatchPair } from "../../../../entity/Match";
import { MatchingAlgoStats } from "../matching/types";
import { MatchNotificationStatus } from "./notifications";

export type MatchMakingResult = {
    dryRun: boolean;
    createdMatches: MatchPair[] | null;
    failedNotifications: MatchNotificationStatus[] | null;
    matchingStats: MatchingAlgoStats;
};