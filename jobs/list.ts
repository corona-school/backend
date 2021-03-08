import { CSCronJob } from "./types";

//import the jobs
import screeningReminderJob from "./periodic/screening-reminder";
import courseReminderJob from "./periodic/course-reminder";
import feedbackRequestJob from "./periodic/feedback-request";
import matchFollowUpJob from "./periodic/match-follow-up";
import jufoVerificationInfo from "./periodic/jufo-verification-info";
import projectMatchMaking from "./periodic/project-match-making";
import tutoringMatchMaking from "./periodic/tutoring-match-making";

// A list of all jobs that should be scheduled at the moment
export const allJobs: CSCronJob[] = [
    // every morning
    { cronTime: "00 15 08 * * *", jobFunction: screeningReminderJob},
    { cronTime: "00 34 08 * * *", jobFunction: projectMatchMaking},
    // { cronTime: "00 56 08 * * *", jobFunction: tutoringMatchMaking}, // only scheduled manually, at the moment
    // every morning, but a little later
    { cronTime: "00 15 09 * * *", jobFunction: courseReminderJob},
    // every morning, but a little bit later
    // { cronTime: "00 15 10 * * *", jobFunction: feedbackRequestJob},  // disabled for now, because at the moment it is not used in production
    // { cronTime: "00 15 11 * * *", jobFunction: matchFollowUpJob},    // disabled for now, because at the moment it is not used in production
    // every afternoon
    { cronTime: "00 35 15 * * *", jobFunction: projectMatchMaking},
    // { cronTime: "00 47 14 * * *", jobFunction: tutoringMatchMaking}, // only scheduled manually, at the moment
    // every day at midnight/beginning
    { cronTime: "00 00 00 * * *", jobFunction: jufoVerificationInfo}
];