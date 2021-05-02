import { MatchingAlgoSettings } from "../matching/types";
import { NotificationOptions } from "./notifications";

export interface MatchMakingOptions {
    dryRun: boolean;
    notifications: NotificationOptions;
    matchingAlgoSettings?: MatchingAlgoSettings;
}