import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import * as Notification from '../../common/notification';
import { userForPupil } from '../user';
import * as Prisma from '@prisma/client';
import { getFirstLecture } from './lectures';
import { parseSubjectString } from '../util/subjectsutils';
import { getCourseCapacity, getCourseImageURL } from './util';
import { getCourse } from '../../graphql/util';
import { NotificationContext } from '../notification/types';
import moment from 'moment';
import { Decision } from '../util/decision';
import { shuffleArray } from '../util/basic';
import { NotAllowedError } from '../util/error';

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
        await Notification.actionTaken(userForPupil(participant.pupil), 'participant_course_cancelled', {
            uniqueId: `${subcourse.id}`,
            ...(await getNotificationContextForSubcourse(course, subcourse)),
        });
    }
}

export async function getNotificationContextForSubcourse(course: { name: string; description: string; imageKey: string }, subcourse: Prisma.subcourse) {
    const { start } = await getFirstLecture(subcourse);

    const date = start.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', day: 'numeric', month: 'long', year: 'numeric' });
    const day = start.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'long' });
    const time = start.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: 'numeric', minute: 'numeric' });

    return {
        relation: `subcourse/${subcourse.id}`,
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

export const canPromoteSubcourse = async (subcourse: Prisma.subcourse, attemptedPromotionType: Prisma.subcourse_promotion_type_enum): Promise<Decision> => {
    const { alreadyPromoted, publishedAt, published, cancelled } = subcourse;

    //  ----------- Validate promotion type -----------
    const allowedPromotions = [
        Prisma.subcourse_promotion_type_enum.admin,
        Prisma.subcourse_promotion_type_enum.instructor,
        Prisma.subcourse_promotion_type_enum.system,
    ];
    if (!allowedPromotions.includes(attemptedPromotionType)) {
        return { allowed: false, reason: 'invalid-promotion-type' };
    }

    //  ----------- Subcourse can't be cancelled -----------
    if (cancelled) {
        return { allowed: false, reason: 'course-cancelled' };
    }

    // ----------- Subcourse can't be in the past -----------
    const lectures = await prisma.lecture.findMany({ where: { subcourseId: subcourse.id, isCanceled: false } });
    const isInThePast = lectures.every((lecture) => moment(lecture.start).valueOf() + lecture.duration * 60000 < moment().valueOf());
    if (isInThePast) {
        return { allowed: false, reason: 'course-in-the-past' };
    }

    // -----------  Subcourse can't have a capacity higher than 75% -----------
    const MAX_CAPACITY_FOR_PROMOTIONS = 0.75;
    const capacity = await getCourseCapacity(subcourse);
    const meetCapacityRequirements = capacity < MAX_CAPACITY_FOR_PROMOTIONS;
    if (!meetCapacityRequirements) {
        return { allowed: false, reason: 'course-capacity-too-high' };
    }

    // -----------  Subcourse must be published -----------
    if (!published) {
        return { allowed: false, reason: 'course-is-not-published' };
    }

    // ----------- Subcourse must be published for at least 3 days (This does NOT apply to system promotions) -----------
    const isSystemPromotion = attemptedPromotionType === Prisma.subcourse_promotion_type_enum.system;
    if (!isSystemPromotion) {
        const MIN_DAYS_PUBLISHED_FOR_PROMOTIONS = 3;
        const daysSincePublished = getDaysDifference(publishedAt);
        const isMatureForPromotion = daysSincePublished > MIN_DAYS_PUBLISHED_FOR_PROMOTIONS;
        if (!isMatureForPromotion) {
            return { allowed: false, reason: 'course-is-not-mature-enough' };
        }
    }

    // -----------  We only have one automatic promotion, it should be the first -----------
    if (isSystemPromotion) {
        const promotionsCount = await prisma.subcourse_promotion.count({
            where: { subcourseId: subcourse.id },
        });
        const canAutoPromote = promotionsCount === 0 && !alreadyPromoted;
        if (!canAutoPromote) {
            return { allowed: false, reason: 'already-auto-promoted' };
        }
    }

    // -----------  Instructors can only promote once -----------
    const isInstructorPromotion = attemptedPromotionType === Prisma.subcourse_promotion_type_enum.instructor;
    const MAX_INSTRUCTOR_PROMOTIONS = 1;
    if (isInstructorPromotion) {
        const instructorPromotionsCount = await prisma.subcourse_promotion.count({
            where: { subcourseId: subcourse.id, type: Prisma.subcourse_promotion_type_enum.instructor },
        });
        const hasPromotionsLeft = MAX_INSTRUCTOR_PROMOTIONS - instructorPromotionsCount > 0;
        // TODO: Removed the alreadyPromoted validation after we migrate the data to the new subcourse_promotion table
        const allowed = hasPromotionsLeft && !alreadyPromoted;
        if (!allowed) {
            return { allowed: false, reason: 'no-instructor-promotions-left' };
        }
    }

    // -----------  Admins can only promote once -----------
    const isAdminPromotion = attemptedPromotionType === Prisma.subcourse_promotion_type_enum.admin;
    const MAX_ADMIN_PROMOTIONS = 1;
    if (isAdminPromotion) {
        const adminPromotionsCount = await prisma.subcourse_promotion.count({
            where: { subcourseId: subcourse.id, type: Prisma.subcourse_promotion_type_enum.admin },
        });
        const hasPromotionsLeft = MAX_ADMIN_PROMOTIONS - adminPromotionsCount > 0;
        if (!hasPromotionsLeft) {
            return { allowed: false, reason: 'no-admin-promotions-left' };
        }
    }

    // -----------  There must be a gap of at least 3 days between promotions -----------
    const threeDaysAgo = moment().subtract(3, 'days').toDate();
    const promotionWithinThreeDays = await prisma.subcourse_promotion.findFirst({ where: { subcourseId: subcourse.id, createdAt: { gte: threeDaysAgo } } });
    if (promotionWithinThreeDays) {
        return { allowed: false, reason: 'recently-promoted' };
    }

    return { allowed: true, reason: '' };
};

export async function sendPupilCoursePromotion(subcourse: Prisma.subcourse, promotionType: Prisma.subcourse_promotion_type_enum) {
    const { allowed, reason } = await canPromoteSubcourse(subcourse, promotionType);
    if (!allowed) {
        logger.info(`Can't promote Subcourse(${subcourse.id}). Reason: ${reason}`);
        if (reason == 'invalid-promotion-type') {
            throw new NotAllowedError(`Promotion type for Subcourse(${subcourse.id}) is not valid!`);
        } else if (reason == 'course-cancelled') {
            throw new NotAllowedError(`Subcourse(${subcourse.id}) is cancelled!`);
        } else if (reason == 'course-in-the-past') {
            throw new NotAllowedError(`Subcourse(${subcourse.id}) is in the past!`);
        } else if (reason == 'course-capacity-too-high') {
            throw new NotAllowedError(`Capacity for Subcourse(${subcourse.id}) is higher than 75%!`);
        } else if (reason == 'course-is-not-published') {
            throw new NotAllowedError(`Subcourse(${subcourse.id}) is not published!`);
        } else if (reason == 'course-is-not-mature-enough') {
            throw new NotAllowedError(`Subcourse(${subcourse.id}) is published for less than 3 days!`);
        } else if (reason == 'already-auto-promoted') {
            throw new NotAllowedError(`Subcourse(${subcourse.id}) is already promoted automatically!`);
        } else if (reason == 'no-instructor-promotions-left') {
            throw new NotAllowedError(`Instructors can only promote a Subcourse once!`);
        } else if (reason == 'no-admin-promotions-left') {
            throw new NotAllowedError(`Admins can only promote a Subcourse once!`);
        } else if (reason == 'recently-promoted') {
            throw new NotAllowedError(`Subcourse(${subcourse.id}) has already been promoted less than 3 days ago!`);
        } else {
            throw new NotAllowedError('Subcourse(${subcourse.id}) can not be promoted for a different reason: ${reason}!');
        }
    }

    await prisma.subcourse_promotion.create({
        data: { type: promotionType, subcourseId: subcourse.id },
    });

    const course = await getCourse(subcourse.courseId);
    const minGrade = subcourse.minGrade;
    const maxGrade = subcourse.maxGrade;
    const grades = [];
    for (let grade = minGrade; grade <= maxGrade; grade++) {
        grades.push(`${grade}. Klasse`);
    }

    const pupils = await prisma.pupil.findMany({
        where: {
            active: true,
            verification: null,
            isParticipant: true,
            OR: [
                {
                    subcourse_participants_pupil: {
                        some: {},
                    },
                },
                {
                    match: {
                        some: {},
                    },
                },
                {
                    pupil_screening: {
                        some: {
                            status: 'success',
                        },
                    },
                },
            ],
            notificationPreferences: {
                path: ['suggestion', 'email'],
                equals: true,
            },
            grade: { in: grades },
            subcourse_participants_pupil: { none: { subcourseId: subcourse.id } },
        },
    });

    const courseSubject = course.subject;
    let filteredPupils = pupils.filter((pupil) => {
        const subjects = parseSubjectString(pupil.subjects);
        const isPupilsSubject = subjects.some((subject) => subject.name == courseSubject);
        return !courseSubject || isPupilsSubject;
    });

    const MAX_PROMOTIONS = Number(process.env.MAX_PROMOTIONS);

    if (MAX_PROMOTIONS && !isNaN(MAX_PROMOTIONS)) {
        const randomPupilSampleSize = Math.min(filteredPupils.length, MAX_PROMOTIONS);
        const shuffledFilteredPupils = shuffleArray(filteredPupils);
        const initialAmountOfPupils = filteredPupils.length;
        filteredPupils = shuffledFilteredPupils.slice(0, randomPupilSampleSize);
        const reducedAmountOfPupils = filteredPupils.length;
        logger.info(`Filtered ${initialAmountOfPupils} pupils that could join the Subcourse(${subcourse.id}) and reduced that to ${reducedAmountOfPupils}`, {
            subcourseId: subcourse.id,
        });
    }

    const context = await getNotificationContextForSubcourse(course, subcourse);
    (context as NotificationContext).uniqueId = 'promote_subcourse_' + subcourse.id + '_at_' + Date.now();
    await Notification.bulkActionTaken(
        filteredPupils.map((pupil) => userForPupil(pupil)),
        'available_places_on_subcourse',
        context
    );

    logger.info(`Sent ${filteredPupils.length} notifications to promote Subcourse(${subcourse.id})`);
}
