import { MatchingAlgoSettings } from "../matching/types";

export interface MatchMakingOptions {
    dryRun: boolean;
    matchingAlgoSettings?: MatchingAlgoSettings;
    // If true, no notifications are sent to the matched
    silent: boolean;
}