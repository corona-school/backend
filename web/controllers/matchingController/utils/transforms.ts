import { MatchMakingResult } from "../../../../common/administration/match-making/tutoring/types/matchmaking-result";
import { MatchNotificationStatus, NotificationOptions } from "../../../../common/administration/match-making/tutoring/types/notifications";
import { MatchingOptions } from "../../../../common/administration/match-making/tutoring/types/options";
import { MatchPair } from "../../../../common/entity/Match";
import { ApiMatchingOptions, ApiNotificationOption } from "../types/matching-options";
import { ApiFailedNotification, ApiMatch, ApiMatchMakingResult } from "../types/matchmaking-result";

export function transformApiNotificationOptionToInternal(notificationOption: ApiNotificationOption): NotificationOptions {
    const sms = [ApiNotificationOption.sms, ApiNotificationOption.emailAndSMS].includes(notificationOption);
    const email = [ApiNotificationOption.email, ApiNotificationOption.emailAndSMS].includes(notificationOption);
    return {
        email,
        sms
    };
}

export function transformApiMatchingOptionsToInternal(options: ApiMatchingOptions): MatchingOptions {
    return {
        dryRun: options.dryRun,
        notifications: transformApiNotificationOptionToInternal(options.notifications)
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
            subjects: helpee.getSubjectsFormatted()
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
        type: notificationStatus.type,
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
        notificationChannelsUsed: result.notifications,
        failedNotifications: result.failedNotifications?.map(ns => transformMatchNotificationStatusToApi(ns))
    };
}