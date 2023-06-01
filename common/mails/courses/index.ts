import { Subcourse } from '../../entity/Subcourse';
import { Course } from '../../entity/Course';
import { prisma } from '../../prisma';
import { mailjetTemplates, sendTemplateMail, sendTextEmail } from '../index';
import moment from 'moment-timezone';
import { getLogger } from '../../logger/logger';
import { Student } from '../../entity/Student';
import { Pupil } from '../../entity/Pupil';
import { DEFAULTSENDERS } from '../config';
import { CourseGuest, getCourseGuestLink } from '../../entity/CourseGuest';
import * as Notification from '../../../common/notification';
import { getFullName, userForPupil } from '../../user';
import * as Prisma from '@prisma/client';
import { getFirstLecture } from '../../courses/lectures';
import { parseSubjectString } from '../../util/subjectsutils';
import { getCourseCapacity, isParticipant } from '../../courses/participants';
import { getCourseImageURL } from '../../courses/util';
import { createSecretEmailToken } from '../../secret';
import { getCourse } from '../../../graphql/util';
import { shuffleArray } from '../../../common/util/basic';

const logger = getLogger('Course Notification');

const dropCourseRelations = (course: Course | Prisma.course) => ({
    ...course,
    instructors: undefined,
    guests: undefined,
    correspondent: undefined,
    subcourses: undefined,
});

const dropSubcourseRelations = (subcourse: Subcourse | Prisma.subcourse) => ({
    ...subcourse,
    instructors: undefined,
    participants: undefined,
    waitingList: undefined,
    course: undefined,
});

export async function sendSubcourseCancelNotifications(course: Course | Prisma.course, subcourse: Subcourse | Prisma.subcourse) {
    let lectures = await prisma.lecture.findMany({ where: { subcourseId: subcourse.id } });
    if (lectures.length == 0) {
        logger.info('No lectures found: no cancellation mails sent for subcourse ' + subcourse.id + ' of course ' + course.name);
        return;
    }

    // Find first lecture, subcourse lectures are eagerly loaded
    let firstLecture = lectures[0].start;
    for (let i = 1; i < lectures.length; i++) {
        if (lectures[i].start < firstLecture) {
            firstLecture = lectures[i].start;
        }
    }

    let participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, select: { pupil: true } });
    // Send mail or this lecture to each participant
    logger.info('Sending cancellation mails for subcourse ' + subcourse.id + ' of course ' + course.name + ' to ' + participants.length + ' participants');
    for (let participant of participants) {
        const mail = mailjetTemplates.COURSESCANCELLED({
            participantFirstname: participant.pupil.firstname,
            courseName: course.name,
            firstLectureDate: moment(firstLecture).format('DD.MM.YYYY'),
            firstLectureTime: moment(firstLecture).format('HH:mm'),
        });
        await sendTemplateMail(mail, participant.pupil.email);
        await Notification.actionTaken(participant.pupil, 'participant_course_cancelled', {
            uniqueId: `${subcourse.id}`,
            course: dropCourseRelations(course),
            subcourse: dropSubcourseRelations(subcourse),
            firstLectureDate: moment(firstLecture).format('DD.MM.YYYY'),
            firstLectureTime: moment(firstLecture).format('HH:mm'),
        });
    }
}

export async function sendCourseUpcomingReminderInstructor(
    instructor: Student | Prisma.student,
    course: Prisma.course,
    subcourse: Prisma.subcourse,
    firstLecture: Date
) {
    const mail = mailjetTemplates.COURSESUPCOMINGREMINDERINSTRUCTOR({
        participantFirstname: instructor.firstname,
        courseName: course.name,
        courseId: course.id,
        firstLectureDate: moment(firstLecture).format('DD.MM.YYYY'),
        firstLectureTime: moment(firstLecture).format('HH:mm'),
    });
    await sendTemplateMail(mail, instructor.email);
    await Notification.actionTaken(instructor, 'instructor_course_reminder', {
        course,
        subcourse,
        firstLectureDate: moment(firstLecture).format('DD.MM.YYYY'),
        firstLectureTime: moment(firstLecture).format('HH:mm'),
    });
}

export async function sendCourseUpcomingReminderParticipant(
    participant: Pupil | Prisma.pupil,
    course: Prisma.course,
    subcourse: Prisma.subcourse,
    firstLecture: Date
) {
    await Notification.actionTaken(participant, 'participant_subcourse_reminder', {
        subcourse,
        course,
        firstLectureDate: moment(firstLecture).format('DD.MM.YYYY'),
        firstLectureTime: moment(firstLecture).format('HH:mm'),
    });
}

export async function sendParticipantRegistrationConfirmationMail(participant: Pupil, course: Course, subcourse: Subcourse) {
    const firstLecture = subcourse.firstLecture();

    if (!firstLecture) {
        throw new Error(`Cannot send registration confirmation mail for subcourse with ID ${subcourse.id}, because that course has no specified first lecture`);
    }

    const firstLectureMoment = moment(firstLecture.start);
    const authToken = await createSecretEmailToken(userForPupil(participant), undefined, moment().add(7, 'days'));

    const mail = mailjetTemplates.COURSESPARTICIPANTREGISTRATIONCONFIRMATION({
        participantFirstname: participant.firstname,
        courseName: course.name,
        courseId: String(course.id),
        firstLectureDate: firstLectureMoment.format('DD.MM.YYYY'),
        firstLectureTime: firstLectureMoment.format('HH:mm'),
        authToken,
    });

    await sendTemplateMail(mail, participant.email);

    await Notification.actionTaken(participant, 'participant_course_joined', {
        course,
        firstLectureDate: firstLectureMoment.format('DD.MM.YYYY'),
        firstLectureTime: firstLectureMoment.format('HH:mm'),
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

export async function sendGuestInvitationMail({ id }: Pick<CourseGuest, 'id'>) {
    const guest = await prisma.course_guest.findUniqueOrThrow({ where: { id: id } });
    const inviter = await prisma.student.findUniqueOrThrow({ where: { id: guest.inviterId } });
    const course = await prisma.course.findUniqueOrThrow({ where: { id: guest.courseId } });
    const subcourse = await prisma.subcourse.findFirstOrThrow({
        where: { courseId: course.id },
    });

    const firstLecture = await getFirstLecture(subcourse);
    const firstLectureMoment = moment(firstLecture.start);

    const mail = mailjetTemplates.COURSESGUESTINVITATION({
        guestFirstname: guest.firstname,
        hostFirstname: inviter.firstname,
        hostEmail: inviter.email,
        courseName: course.name,
        firstLectureDate: firstLectureMoment.format('DD.MM.YYYY'),
        firstLectureTime: firstLectureMoment.format('HH:mm'),
        linkVideochat: getCourseGuestLink(guest),
    });

    await sendTemplateMail(mail, guest.email);
}

export async function sendParticipantCourseCertificate(participant: Pupil, course: Course, certificateBuffer: Buffer) {
    //create base 64 version of pdf certificate
    const base64Certificate = certificateBuffer.toString('base64');

    //create mail
    const mail = mailjetTemplates.COURSESCERTIFICATE(
        {
            participantFirstname: participant.firstname,
            courseName: course.name,
        },
        base64Certificate
    );

    //send mail 🎉
    await sendTemplateMail(mail, participant.email);
}

async function getNotificationContextForSubcourse(course: { name: string; description: string; imageKey: string }, subcourse: Prisma.subcourse) {
    const { start } = await getFirstLecture(subcourse);

    const date = start.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', day: 'numeric', month: 'long', year: 'numeric' });
    const day = start.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'long' });
    const time = start.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: 'numeric', minute: 'numeric' });

    return {
        course: {
            name: course.name,
            description: course.description,
            image: getCourseImageURL(course),
        },
        subcourse: {
            url: `https://app.lern-fair.de/single-course/${subcourse.id}`,
        },
        firstLecture: {
            date,
            time,
            day,
        },
    };
}

const getDaysDifference = (date: Date): number => {
    const today = new Date().getTime();
    const published = new Date(date).getTime();
    const diffInMs = today - published;
    if (!diffInMs) {
        return;
    }
    const diffInSec = diffInMs / 1000;
    const diffInMin = diffInSec / 60;
    const diffInHours = diffInMin / 60;
    const diffInDays = diffInHours / 24;

    return diffInDays;
};

const isPromotionValid = (publishedAt: Date, capacity: number, alreadyPromoted: boolean): boolean => {
    const daysDiff: number | null = publishedAt ? getDaysDifference(publishedAt) : null;
    return capacity < 0.75 && alreadyPromoted === false && (daysDiff === null || daysDiff > 3);
};

export async function sendPupilCoursePromotion(subcourse: Prisma.subcourse) {
    const predictedPupilResponseRate = 5; // in percent

    const courseCapacity = await getCourseCapacity(subcourse);
    const { alreadyPromoted, publishedAt } = subcourse;
    if (!isPromotionValid(publishedAt, courseCapacity, alreadyPromoted)) {
        throw new Error(`Promotion for Subcourse(${subcourse.id}) is not valid!`);
    }

    const course = await getCourse(subcourse.courseId);
    const minGrade = subcourse.minGrade;
    const maxGrade = subcourse.maxGrade;
    const grades = [];
    for (let grade = minGrade; grade <= maxGrade; grade++) {
        grades.push(`${grade}. Klasse`);
    }

    let pupils = await prisma.pupil.findMany({
        where: { active: true, isParticipant: true, grade: { in: grades }, subcourse_participants_pupil: { none: { subcourseId: subcourse.id } } },
    });

    const courseSubject = course.subject;
    const filteredPupils = pupils.filter((pupil) => {
        const subjects = parseSubjectString(pupil.subjects);
        const isPupilsSubject = subjects.some((subject) => subject.name == courseSubject);
        return !courseSubject || isPupilsSubject;
    });

    const shuffledFilteredPupils = shuffleArray(filteredPupils);

    // get random subset of filtered pupils
    const seatsLeft = subcourse.maxParticipants * courseCapacity;
    const randomPupilSampleSize = (seatsLeft / predictedPupilResponseRate) * 100;
    const randomFilteredPupilSample = shuffledFilteredPupils.slice(0, randomPupilSampleSize);

    logger.info(
        `Filtered ${filteredPupils.length} pupils and reduced that to (${randomFilteredPupilSample.length})
        for Subcourse(${subcourse}) based on the predicted response rate`
    );

    const context = await getNotificationContextForSubcourse(course, subcourse);
    await Notification.bulkActionTaken(
        randomFilteredPupilSample.map((pupil) => userForPupil(pupil)),
        'available_places_on_subcourse',
        context
    );

    logger.info(`Sent ${randomFilteredPupilSample.length} notifications to promote Subcourse(${subcourse.id})`);
}
