import { prisma } from '../../prisma';
import { mailjetTemplates, sendTemplateMail, sendTextEmail } from '../index';
import moment from 'moment-timezone';
import { getLogger } from '../../logger/logger';
import { DEFAULTSENDERS } from '../config';
import * as Notification from '../../../common/notification';
import { getFullName, userForPupil, userForStudent } from '../../user';
import * as Prisma from '@prisma/client';
import { getFirstLecture } from '../../courses/lectures';
import { parseSubjectString } from '../../util/subjectsutils';
import { getCourseCapacity, getCourseFreePlaces, isParticipant } from '../../courses/participants';
import { getCourseImageURL } from '../../courses/util';
import { createSecretEmailToken } from '../../secret';
import { getCourse } from '../../../graphql/util';
import { shuffleArray } from '../../../common/util/basic';
import { NotificationContext } from '../../notification/types';

const logger = getLogger('Course Notification');

export async function sendSubcourseCancelNotifications(course: Prisma.course, subcourse: Prisma.subcourse) {
    const lectures = await prisma.lecture.findMany({ where: { subcourseId: subcourse.id } });
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

    const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, select: { pupil: true } });
    // Send mail or this lecture to each participant
    logger.info('Sending cancellation mails for subcourse ' + subcourse.id + ' of course ' + course.name + ' to ' + participants.length + ' participants');
    for (const participant of participants) {
        const mail = mailjetTemplates.COURSESCANCELLED({
            participantFirstname: participant.pupil.firstname,
            courseName: course.name,
            firstLectureDate: moment(firstLecture).format('DD.MM.YYYY'),
            firstLectureTime: moment(firstLecture).format('HH:mm'),
        });
        await sendTemplateMail(mail, participant.pupil.email);
        await Notification.actionTaken(userForPupil(participant.pupil), 'participant_course_cancelled', {
            uniqueId: `${subcourse.id}`,
            ...(await getNotificationContextForSubcourse(course, subcourse)),
        });
    }
}

export async function sendCourseUpcomingReminderInstructor(instructor: Prisma.student, course: Prisma.course, subcourse: Prisma.subcourse, firstLecture: Date) {
    const mail = mailjetTemplates.COURSESUPCOMINGREMINDERINSTRUCTOR({
        participantFirstname: instructor.firstname,
        courseName: course.name,
        courseId: course.id,
        firstLectureDate: moment(firstLecture).format('DD.MM.YYYY'),
        firstLectureTime: moment(firstLecture).format('HH:mm'),
    });
    await sendTemplateMail(mail, instructor.email);
    await Notification.actionTaken(userForStudent(instructor), 'instructor_course_reminder', await getNotificationContextForSubcourse(course, subcourse));
}

export async function sendCourseUpcomingReminderParticipant(participant: Prisma.pupil, course: Prisma.course, subcourse: Prisma.subcourse, firstLecture: Date) {
    await Notification.actionTaken(userForPupil(participant), 'participant_subcourse_reminder', await getNotificationContextForSubcourse(course, subcourse));
}

export async function getNotificationContextForSubcourse(course: { name: string; description: string; imageKey: string }, subcourse: Prisma.subcourse) {
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
            id: '' + subcourse.id,
        },
        firstLecture: {
            date,
            time,
            day,
        },
        // TODO: Legacy, remove
        firstLectureDate: date,
        firstLectureTime: time,
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

const PREDICTED_PUPIL_RESPONSE_RATE = 1; /* % */

export async function sendPupilCoursePromotion(subcourse: Prisma.subcourse) {
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

    const pupils = await prisma.pupil.findMany({
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
    const seatsLeft = await getCourseFreePlaces(subcourse);
    const randomPupilSampleSize = (seatsLeft / PREDICTED_PUPIL_RESPONSE_RATE) * 100;
    const randomFilteredPupilSample = shuffledFilteredPupils.slice(0, randomPupilSampleSize);

    logger.info(
        `Filtered ${filteredPupils.length} pupils that could join the course and reduced that to ${randomFilteredPupilSample.length} (for ${seatsLeft} available places)
        for Subcourse(${subcourse.id}) based on the predicted response rate of ${PREDICTED_PUPIL_RESPONSE_RATE}%`,
        { subcourseId: subcourse.id }
    );

    const context = await getNotificationContextForSubcourse(course, subcourse);
    (context as NotificationContext).uniqueId = 'promote_subcourse_' + subcourse.id + '_at_' + Date.now();
    await Notification.bulkActionTaken(
        randomFilteredPupilSample.map((pupil) => userForPupil(pupil)),
        'available_places_on_subcourse',
        context
    );

    logger.info(`Sent ${randomFilteredPupilSample.length} notifications to promote Subcourse(${subcourse.id})`);
}
