import { MatchMakingResult } from "../../../../common/administration/match-making/tutoring/types/matchmaking-result";
import { MatchNotificationStatus } from "../../../../common/administration/match-making/tutoring/types/notifications";
import { MatchMakingOptions } from "../../../../common/administration/match-making/tutoring/types/options";
import { MatchPair } from "../../../../common/entity/Match";
import { ApiMatchingOptions, ApiNotificationOption } from "../types/matching-options";
import { ApiFailedNotification, ApiMatch, ApiMatchMakingResult } from "../types/matchmaking-result";


export function transformApiMatchingOptionsToInternal(options: ApiMatchingOptions): MatchMakingOptions {
    return {
        dryRun: options.dryRun,
        matchingAlgoSettings: options.matchingAlgoSettings,
        silent: options.notifications === ApiNotificationOption.dbEntryOnly
    };
}

export function transformMatchPairToApiMatch(matchPair: MatchPair): ApiMatch {
    const helpee = matchPair.pupil;
    const helper = matchPair.student;
    return {
        helpee: {
            uuid: helpee.wix_id,
            email: helpee.email,
            grade: helpee.gradeAsNumber(),
            subjects: helpee.getSubjectsFormatted().map(s => ({name: s.name})) // for helpees only output the subject name
        },
        helper: {
            uuid: helper.wix_id,
            email: helper.email,
            subjects: helper.getSubjectsFormatted()
        }
    };
}

export function transformMatchNotificationStatusToApi(notificationStatus: MatchNotificationStatus): ApiFailedNotification {
    return {
        matchUUID: notificationStatus.match.uuid,
        errorMessage: notificationStatus.error?.underlyingError?.message,
        affectedTuteeEmail: notificationStatus.error?.affectedTutee?.email,
        affectedTutorEmail: notificationStatus.error?.affectedTutor?.email
    };
}
export function transformInternalMatchMakingResultToApi(result: MatchMakingResult): ApiMatchMakingResult {
    return {
        wasDryRun: result.dryRun,
        stats: result.matchingStats,
        matches: result.createdMatches?.map(m => transformMatchPairToApiMatch(m)),
        failedNotifications: result.failedNotifications?.map(ns => transformMatchNotificationStatusToApi(ns))
    };
}