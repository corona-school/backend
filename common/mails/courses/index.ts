import { Course } from "../../entity/Course";
import { Subcourse } from "../../entity/Subcourse";
import { mailjetTemplates, sendTemplateMail } from "../index";
import * as moment from "moment";
import { getLogger } from "log4js";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

const logger = getLogger();

export async function sendSubcourseCancelNotifications(course: Course, subcourse: Subcourse) {

    if (subcourse.lectures.length == 0) {
        logger.info("No lectures found: no cancellation mails sent for subcourse " + subcourse.id + " of course " + course.name);
        return;
    }

    // Find first lecture, subcourse lectures are eagerly loaded
    let firstLecture = subcourse.lectures[0].start;
    for (let i = 1; i < subcourse.lectures.length; i++) {
        if (subcourse.lectures[i].start < firstLecture) {
            firstLecture = subcourse.lectures[i].start;
        }
    }

    // Send mail or this lecture to each participant
    logger.info("Sending cancellation mails for subcourse " + subcourse.id + " of course " + course.name + " to " + subcourse.participants.length + " participants");
    for (let participant of subcourse.participants) {
        const mail = mailjetTemplates.COURSESCANCELLED({
            participantFirstname: participant.firstname,
            courseName: course.name,
            firstLectureDate: moment(firstLecture).format("DD.MM.YYYY"),
            firstLectureTime: moment(firstLecture).format("HH:mm")
        });
        await sendTemplateMail(mail, participant.email);
    }
}

export async function sendCourseUpcomingReminderInstructor(instructor: Student, course: Course, firstLecture: Date) {
    const mail = mailjetTemplates.COURSESUPCOMINGREMINDERINSTRUCTOR({
        participantFirstname: instructor.firstname,
        courseName: course.name,
        firstLectureDate: moment(firstLecture).format("DD.MM.YYYY"),
        firstLectureTime: moment(firstLecture).format("HH:mm")
    });
    await sendTemplateMail(mail, instructor.email);
}

export async function sendCourseUpcomingReminderParticipant(participant: Pupil, course: Course, firstLecture: Date) {
    const mail = mailjetTemplates.COURSESUPCOMINGREMINDERPARTICIPANT({
        participantFirstname: participant.firstname,
        courseName: course.name,
        firstLectureDate: moment(firstLecture).format("DD.MM.YYYY"),
        firstLectureTime: moment(firstLecture).format("HH:mm")
    });
    await sendTemplateMail(mail, participant.email);
}

export async function sendInstructorGroupMail(participant: Pupil, instructor: Student, course: Course, messageTitle: string, messageBody: string) {
    const mail = mailjetTemplates.COURSEINSTRUCTORGROUPMAIL({
        participantFirstname: participant.firstname,
        courseName: course.name,
        messageTitle: messageTitle,
        messageBody: messageBody,
        instructorMail: instructor.email
    });

    await sendTemplateMail(mail, participant.email, instructor.email);
}