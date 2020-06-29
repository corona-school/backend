import { CSCronJob } from "./types";

//import the jobs
import fetchJob from "./periodic/fetch";
import screeningReminderJob from "./periodic/screening-reminder";
import courseReminderJob from "./periodic/course-reminder";
import feedbackRequestJob from "./periodic/feedback-request";
import matchFollowUpJob from "./periodic/match-follow-up";

// A list of all jobs that should be scheduled at the moment
export const allJobs: CSCronJob[] = [
    // every 30 seconds
    { cronTime: "*/30 * * * * *", jobFunction: fetchJob},
    // every morning
    { cronTime: "00 15 08 * * *", jobFunction: screeningReminderJob},
    // every morning, but a little later
    { cronTime: "00 15 09 * * *", jobFunction: courseReminderJob},
    // every morning, but a little bit later
    { cronTime: "00 15 10 * * *", jobFunction: feedbackRequestJob},
    { cronTime: "00 15 11 * * *", jobFunction: matchFollowUpJob}
];