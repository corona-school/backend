import { CSCronJob } from "./types";

//import the jobs
import fetchJob from "./periodic/fetch";
import screeningReminderJob from "./periodic/screening-reminder";
import courseReminderJob from "./periodic/course-reminder";
import feedbackRequestJob from "./periodic/feedback-request";
import matchFollowUpJob from "./periodic/match-follow-up";
import jufoVerificationInfo from "./periodic/jufo-verification-info";
import projectMatchMaking from "./periodic/project-match-making";

// A list of all jobs that should be scheduled at the moment
export const allJobs: CSCronJob[] = [
    // every 30 seconds
    { cronTime: "*/30 * * * * *", jobFunction: fetchJob},
    // every morning
    { cronTime: "00 15 08 * * *", jobFunction: screeningReminderJob},
    { cronTime: "00 34 08 * * *", jobFunction: projectMatchMaking},
    // every morning, but a little later
    { cronTime: "00 15 09 * * *", jobFunction: courseReminderJob},
    // every morning, but a little bit later
    { cronTime: "00 15 10 * * *", jobFunction: feedbackRequestJob},
    { cronTime: "00 15 11 * * *", jobFunction: matchFollowUpJob},
    // every afternoon
    { cronTime: "00 35 15 * * *", jobFunction: projectMatchMaking},
    // every day at midnight/beginning
    { cronTime: "00 00 00 * * *", jobFunction: jufoVerificationInfo}
];