import { Course } from "../../entity/Course";
import { Subcourse } from "../../entity/Subcourse";
import { mailjetTemplates, sendTemplateMail } from "../index";

export async function sendSubcourseCancelNotifications(course: Course, subcourse: Subcourse) {
    for(let participant of subcourse.participants) {
        const mail = mailjetTemplates.COURSESCANCELLED({
            participantFirstname: participant.firstname,
            courseName: course.name,
            firstLectureDate: null,
            firstLectureTime: null,
        });
        await sendTemplateMail(mail, participant.email);
    }
}