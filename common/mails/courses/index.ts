import { Course } from "../../entity/Course";
import { Subcourse } from "../../entity/Subcourse";
import { mailjetTemplates, sendTemplateMail, sendTextEmail } from "../index";
import moment from "moment-timezone";
import { getLogger } from "log4js";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";
import { DEFAULTSENDERS } from "../config";
import { CourseGuest } from "../../entity/CourseGuest";
import * as Notification from "../../../common/notification";
import { Person } from '../../../common/entity/Person';
import { getFullName } from "../../../common/user";
import * as Prisma from "@prisma/client";

const logger = getLogger();

const dropCourseRelations = (course: Course) =>
    ({ ...course, instructors: undefined, guests: undefined, correspondent: undefined, subcourses: undefined });

const dropSubcourseRelations = (subcourse: Subcourse) =>
    ({ ...subcourse, instructors: undefined, participants: undefined, waitingList: undefined, course: undefined });


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
        await Notification.actionTaken(participant, "participant_course_cancelled", {
            uniqueId: `${subcourse.id}`,
            course: dropCourseRelations(course),
            subcourse: dropSubcourseRelations(subcourse),
            firstLectureDate: moment(firstLecture).format("DD.MM.YYYY"),
            firstLectureTime: moment(firstLecture).format("HH:mm")
        });
    }
}

export async function sendCourseUpcomingReminderInstructor(instructor: Student | Prisma.student, course: Prisma.course, subcourse: Prisma.subcourse, firstLecture: Date) {
    const mail = mailjetTemplates.COURSESUPCOMINGREMINDERINSTRUCTOR({
        participantFirstname: instructor.firstname,
        courseName: course.name,
        firstLectureDate: moment(firstLecture).format("DD.MM.YYYY"),
        firstLectureTime: moment(firstLecture).format("HH:mm")
    });
    await sendTemplateMail(mail, instructor.email);
    await Notification.actionTaken(instructor, "instructor_course_reminder", {
        course,
        subcourse,
        firstLectureDate: moment(firstLecture).format("DD.MM.YYYY"),
        firstLectureTime: moment(firstLecture).format("HH:mm")
    });
}

export async function sendCourseUpcomingReminderParticipant(participant: Pupil | Prisma.pupil, course: Prisma.course, subcourse: Prisma.subcourse, firstLecture: Date) {
    const mail = mailjetTemplates.COURSESUPCOMINGREMINDERPARTICIPANT({
        participantFirstname: participant.firstname,
        courseName: course.name,
        firstLectureDate: moment(firstLecture).format("DD.MM.YYYY"),
        firstLectureTime: moment(firstLecture).format("HH:mm")
    });
    await sendTemplateMail(mail, participant.email);
    await Notification.actionTaken(participant, "participant_subcourse_reminder", {
        subcourse,
        course,
        firstLectureDate: moment(firstLecture).format("DD.MM.YYYY"),
        firstLectureTime: moment(firstLecture).format("HH:mm")
    });
}

export async function sendInstructorGroupMail(participant: Pupil, instructor: Student, course: Course, messageTitle: string, messageBody: string, files?: Express.Multer.File[]) {
    const mail = mailjetTemplates.COURSEINSTRUCTORGROUPMAIL({
        participantFirstName: participant.firstname,
        instructorFirstName: instructor.firstname,
        courseName: course.name,
        messageTitle: messageTitle,
        messageBody: messageBody,
        instructorMail: instructor.email
    }, files);

    await sendTemplateMail(mail, participant.email, instructor.email);
}

export async function sendParticipantRegistrationConfirmationMail(participant: Pupil, course: Course, subcourse: Subcourse) {
    const firstLecture = subcourse.firstLecture();

    if (!firstLecture) {
        throw new Error(`Cannot send registration confirmation mail for subcourse with ID ${subcourse.id}, because that course has no specified first lecture`);
    }

    const firstLectureMoment = moment(firstLecture.start);

    const mail = mailjetTemplates.COURSESPARTICIPANTREGISTRATIONCONFIRMATION({
        participantFirstname: participant.firstname,
        courseName: course.name,
        courseId: String(course.id),
        firstLectureDate: firstLectureMoment.format("DD.MM.YYYY"),
        firstLectureTime: firstLectureMoment.format("HH:mm"),
        authToken: participant.authToken
    });

    await sendTemplateMail(mail, participant.email);

    await Notification.actionTaken(participant, "participant_subcourse_joined", {
        course,
        firstLectureDate: firstLectureMoment.format("DD.MM.YYYY"),
        firstLectureTime: firstLectureMoment.format("HH:mm")
    });
}

export async function sendParticipantToInstructorMail(participant: Pupil, instructor: Student, course: Course, messageTitle: string, messageBody: string) {
    await sendTextEmail(
        `[${course.name}] ${messageTitle}`, //subject
        messageBody, //email text
        DEFAULTSENDERS.noreply, //sender address
        instructor.email, //receiver
        `${getFullName(participant)} via Lern-Fair`, //sender name
        `${getFullName(instructor)}`, //receiver name
        participant.email, //replyTo address
        `${getFullName(participant)}` //replyTo name
    );
}

export async function sendGuestInvitationMail(guest: CourseGuest) {
    const inviter = guest.inviter;
    const course = guest.course;
    const subcourse = course.subcourses?.[0];
    const firstLecture = subcourse?.firstLecture();

    if (!firstLecture) {
        throw new Error(`Cannot send invitation mail for course ${course.id} to guest ${guest.email}, because that course has no subcourse/specified first lecture`);
    }

    const firstLectureMoment = moment(firstLecture.start);

    const mail = mailjetTemplates.COURSESGUESTINVITATION({
        guestFirstname: guest.firstname,
        hostFirstname: inviter.firstname,
        hostEmail: inviter.email,
        courseName: course.name,
        firstLectureDate: firstLectureMoment.format("DD.MM.YYYY"),
        firstLectureTime: firstLectureMoment.format("HH:mm"),
        linkVideochat: guest.getPublicUsableLink()
    });

    await sendTemplateMail(mail, guest.email);
}

export async function sendParticipantCourseCertificate(participant: Pupil, course: Course, certificateBuffer: Buffer) {
    //create base 64 version of pdf certificate
    const base64Certificate = certificateBuffer.toString("base64");

    //create mail
    const mail = mailjetTemplates.COURSESCERTIFICATE({
        participantFirstname: participant.firstname,
        courseName: course.name
    }, base64Certificate);

    //send mail 🎉
    await sendTemplateMail(mail, participant.email);
}