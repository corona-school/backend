/* eslint-disable comma-dangle */
import 'reflect-metadata';
import moment from 'moment-timezone';
import { createHash } from 'crypto';
import { getNotifications, importMessageTranslations, importNotifications } from './common/notification/notification';
import { _createFixedToken, createPassword, verifyEmail } from './common/secret';
import { userForStudent, userForPupil, refetchPupil, refetchStudent, userForScreener, User } from './common/user';
import { getLogger } from './common/logger/logger';
import { registerPupil, RegisterPupilData } from './common/pupil/registration';
import { isDev, isTest } from './common/util/environment';
import { prisma } from './common/prisma';
import { becomeInstructor, becomeTutor, BecomeTutorData, registerStudent } from './common/student/registration';
import { addInstructorScreening, addTutorScreening, scheduleCoCReminders } from './common/student/screening';
import { addPupilScreening } from './common/pupil/screening';
import { createMatch } from './common/match/create';
import { dissolveMatch } from './common/match/dissolve';
import { TEST_POOL } from './common/match/pool';
import { addSubcourseMentor, joinSubcourse, joinSubcourseWaitinglist } from './common/courses/participants';
import { addCourseInstructor, addSubcourseInstructor } from './common/courses/states';
import { createPupilMatchRequest, createStudentMatchRequest } from './common/match/request';
import { createCourseTag } from './common/courses/tags';
import { _setSilenceNotificationSystem } from './common/notification';
import {
    course_category_enum as CourseCategory,
    course_coursestate_enum as CourseState,
    course_subject_enum as CourseSubject,
    dissolve_reason as DissolveReason,
    dissolved_by_enum as DissolvedBy,
    internship_status_enum as InternshipStatus,
    learning_assignment_status,
    learning_offer_constraints_enum as LearningOfferConstraint,
    pupil_email_owner_enum,
    pupil_languages_enum as Language,
    screener as Screener,
    pupil as Pupil,
    student as Student,
} from '@prisma/client';
import { importAchievements } from './seed-achievements';
import { CalendarPreferences, Day, WeeklyAvailability } from './graphql/types/calendarPreferences';
import { Subject } from './common/util/subjectsutils';
import * as certificateOfConduct from './common/certificate-of-conduct/certificateOfConduct';
import { createLectureFeedback } from './common/lecture-feedback';

const logger = getLogger('DevSetup');

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    Time helpers                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

const BERLIN = 'Europe/Berlin';
const DAY_MS = 24 * 60 * 60 * 1000;

const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS);

interface WeeklySchedule {
    /** ISO weekdays: 1 = Monday ... 7 = Sunday */
    weekdays: number[];
    /** Wall time in Berlin, e.g. "16:30" */
    time: string;
    /** Week offset relative to the current week: negative = in the past, 0 = this week, positive = in the future */
    firstWeek: number;
    weeks: number;
    /** Week offsets without an appointment (holidays, illness, ...) */
    skipWeeks?: number[];
}

/** Generates weekly recurring dates at a fixed Berlin wall time, so seeded data looks like real recurring appointments */
const weeklyDates = ({ weekdays, time, firstWeek, weeks, skipWeeks = [] }: WeeklySchedule): Date[] => {
    const [hour, minute] = time.split(':').map(Number);
    const monday = moment.tz(BERLIN).startOf('isoWeek');
    const dates: Date[] = [];
    for (let week = firstWeek; week < firstWeek + weeks; week++) {
        if (skipWeeks.includes(week)) {
            continue;
        }
        for (const weekday of weekdays) {
            dates.push(monday.clone().add(week, 'weeks').isoWeekday(weekday).set({ hour, minute, second: 0, millisecond: 0 }).toDate());
        }
    }
    return dates.sort((a, b) => a.getTime() - b.getTime());
};

/** Local time (default 15:00) `offsetInDays` days from now, used for fixtures with known appointments */
const dayAt = (offsetInDays: number, hour = 15) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetInDays);
    date.setHours(hour, 0, 0, 0);
    return date;
};

/** Either a recurring schedule or an explicit list of dates */
const datesOf = (schedule: WeeklySchedule | Date[]) => (Array.isArray(schedule) ? schedule : weeklyDates(schedule));

/** A Berlin wall time `inDays` days from now, moved to the next workday if it falls onto a weekend */
const workdayAt = (inDays: number, time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const date = moment.tz(BERLIN).add(inDays, 'days').set({ hour, minute, second: 0, millisecond: 0 });
    while (date.isoWeekday() > 5) {
        date.add(1, 'day');
    }
    return date.toDate();
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 Availability helpers                                               */
/* ------------------------------------------------------------------------------------------------------------------ */

const ALL_WEEK: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MON_SAT = ALL_WEEK.slice(0, 6);
const MON_FRI = ALL_WEEK.slice(0, 5);

const createSimpleCalendarPreferences = (weekdays: Day[], slots: { from: string; to: string }[]): CalendarPreferences => {
    function toMinutes(time: string) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    return {
        weeklyAvailability: weekdays.reduce(
            (acc, weekday) => {
                acc[weekday] = slots.map(({ from, to }) => ({
                    from: toMinutes(from),
                    to: toMinutes(to),
                }));
                return acc;
            },
            {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
            } as WeeklyAvailability
        ),
    };
};

/** Hourly slots on the given weekdays, from `fromHour` until `toHour` */
const availability = (weekdays: Day[] = MON_SAT, fromHour = 10, toHour = 21) =>
    createSimpleCalendarPreferences(
        weekdays,
        Array.from({ length: toHour - fromHour }, (_, i) => ({ from: `${fromHour + i}:00`, to: `${fromHour + i + 1}:00` }))
    );

/** A subject a tutor offers, by default for all grades */
const subject = (name: string, min = 1, max = 14): Subject => ({ name, grade: { min, max } });

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      Screenings                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

interface CreateScreeningAppointmentArgs {
    start: Date;
    duration: number;
    title: string;
    screener: Screener;
    participant: User;
    pupilScreeningId?: number;
    tutorScreeningId?: number;
    instructorScreeningId?: number;
}

/** Mirrors the appointments created by the Calendly webhook when somebody books a screening */
const createScreeningAppointment = async ({ start, duration, title, screener, participant, ...screeningIds }: CreateScreeningAppointmentArgs) =>
    await prisma.lecture.create({
        data: {
            start,
            duration,
            title,
            appointmentType: 'screening',
            participantIds: [participant.userID],
            organizerIds: [userForScreener(screener).userID],
            ...screeningIds,
        },
    });

const bookingMessage = (start: Date) =>
    `[System]: Ein Termin wurde am ${moment().format('DD.MM.YYYY HH:mm')} erstellt und findet am ${moment.tz(start, BERLIN).format('DD.MM.YYYY HH:mm')} statt.`;

/** Pupil has a pending screening and booked an appointment `inDays` days from now */
const bookPupilScreening = async (pupil: Pupil, inDays: number, screener: Screener) => {
    const start = workdayAt(inDays, '15:00');
    const screening = await addPupilScreening(await refetchPupil(pupil), { status: 'pending', systemMessages: [bookingMessage(start)] }, true);
    await createScreeningAppointment({
        start,
        duration: 15,
        title: 'Kennenlerngespräch (Schüler:in)',
        screener,
        participant: userForPupil(pupil),
        pupilScreeningId: screening.id,
    });
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        Pupils                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

interface CreatePupilArgs extends Partial<RegisterPupilData> {
    subjects: Subject[];
    languages: Language[];
    gradeAsInt: number;
    calendarPreferences?: CalendarPreferences;
    includePassword?: boolean;
    /** Can request matches (tutoring), default true */
    isPupil?: boolean;
    learningOfferConstraints?: LearningOfferConstraint[];
    /** 'pending' requires `screeningAppointment` to be useful, default is a successful screening */
    screening?: 'success' | 'pending' | 'none';
    screeningAppointment?: { inDays: number; screener: Screener };
    registeredDaysAgo?: number;
}

const createPupil = async ({
    includePassword = true,
    calendarPreferences = availability(),
    isPupil = true,
    learningOfferConstraints = [],
    screening = 'success',
    screeningAppointment,
    registeredDaysAgo = 90,
    ...data
}: CreatePupilArgs) => {
    const pupil = await registerPupil({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        aboutMe: data.aboutMe,
        newsletter: data.newsletter ?? true,
        registrationSource: 'normal',
        school: data.school ?? {
            name: 'Muster Schule',
            schooltype: 'gymnasium',
            state: 'be',
        },
        emailOwner: pupil_email_owner_enum.pupil,
    });
    await _createFixedToken(userForPupil(pupil), `authtokenP${pupil.id}`);
    if (includePassword) {
        await createPassword(userForPupil(pupil), `test`);
    }
    await verifyEmail(userForPupil(pupil));

    const registeredAt = daysFromNow(-registeredDaysAgo);
    if (screening === 'success') {
        const screeningDate = daysFromNow(-registeredDaysAgo + 1);
        await addPupilScreening(await refetchPupil(pupil), { comment: '', status: 'success', invalidated: false }, true);
        await prisma.pupil_screening.updateMany({ where: { pupilId: pupil.id }, data: { createdAt: screeningDate, decisionTakenAt: screeningDate } });
    } else if (screening === 'pending' && screeningAppointment) {
        await bookPupilScreening(pupil, screeningAppointment.inDays, screeningAppointment.screener);
    } else if (screening === 'pending') {
        await addPupilScreening(await refetchPupil(pupil), { status: 'pending' }, true);
    }

    return await prisma.pupil.update({
        where: { id: pupil.id },
        data: {
            createdAt: registeredAt,
            isPupil,
            learningOfferConstraints,
            languages: data.languages,
            subjects: JSON.stringify(data.subjects),
            grade: `${data.gradeAsInt}. Klasse`,
            calendarPreferences: calendarPreferences as Record<string, any>,
        },
    });
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       Students                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

type ScreeningOutcome = 'success' | 'pending' | 'rejection';

interface CreateStudentArgs {
    firstname: string;
    lastname: string;
    email: string;
    aboutMe: string;
    newsletter?: boolean;
    /** Registers the student through a cooperation, e.g. 'uni-freiburg'. University cooperations get an internship on successful screening */
    cooperationTag?: string;
    languages?: BecomeTutorData['languages'];
    subjects?: Subject[];
    supportsInDaZ?: boolean;
    calendarPreferences?: CalendarPreferences;
    /** Wants to be a tutor, undefined = not a tutor */
    tutor?: ScreeningOutcome;
    /** Wants to be an instructor, undefined = not an instructor, 'wannabe' = no screening yet */
    instructor?: ScreeningOutcome | 'wannabe';
    /** Handed in a Certificate of Conduct */
    coc?: boolean;
    /** Only has an effect for cooperation students with a successful screening */
    internship?: InternshipStatus;
    /** Books a screening appointment, only for pending screenings */
    screeningAppointmentInDays?: number;
    hasDoneEthicsOnboarding?: boolean;
    zoomUserId?: string;
    registeredDaysAgo?: number;
}

const createStudent = async (
    {
        calendarPreferences = availability(),
        tutor,
        instructor,
        coc = false,
        registeredDaysAgo = 120,
        languages = [],
        subjects = [],
        cooperationTag,
        ...data
    }: CreateStudentArgs,
    screener: Screener
) => {
    const student = await registerStudent({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        aboutMe: data.aboutMe,
        newsletter: data.newsletter ?? true,
        registrationSource: cooperationTag ? 'cooperation' : 'normal',
        cooperationTag,
        isAdult: true,
    });
    await verifyEmail(userForStudent(student));
    await _createFixedToken(userForStudent(student), `authtokenS${student.id}`);
    await createPassword(userForStudent(student), `test`);

    if (tutor) {
        await becomeTutor(student, { languages, subjects, supportsInDaZ: data.supportsInDaZ });
    }
    if (instructor) {
        await becomeInstructor(await refetchStudent(student), {});
    }

    const current = await refetchStudent(student);
    if (tutor === 'pending') {
        await prisma.screening.create({ data: { studentId: student.id, screenerId: screener.id, status: 'pending' } });
    } else if (tutor) {
        await addTutorScreening(screener, current, { status: tutor });
    }
    if (instructor === 'pending') {
        await prisma.instructor_screening.create({ data: { studentId: student.id, screenerId: screener.id, status: 'pending' } });
    } else if (instructor && instructor !== 'wannabe') {
        await addInstructorScreening(screener, current, { status: instructor, comment: instructor === 'success' ? 'Success' : 'Rejected' }, false);
    }

    const hadSuccessfulScreening = tutor === 'success' || instructor === 'success';
    if (coc) {
        await certificateOfConduct.create(daysFromNow(-registeredDaysAgo + 5), daysFromNow(-registeredDaysAgo + 5), false, student.id);
    }

    if (data.internship === 'completed') {
        await prisma.internship.updateMany({
            where: { studentId: student.id },
            data: { status: 'completed', startDate: daysFromNow(-150), endDate: daysFromNow(-30) },
        });
    } else if (data.internship === 'cancelled') {
        await prisma.internship.updateMany({
            where: { studentId: student.id },
            data: { status: 'cancelled', startDate: daysFromNow(-100), endDate: daysFromNow(-40) },
        });
    }

    // Make the account look like it has existed for a while
    const screeningDate = daysFromNow(-registeredDaysAgo + 2);
    await prisma.screening.updateMany({
        where: { studentId: student.id },
        data: { createdAt: screeningDate, ...(tutor && tutor !== 'pending' ? { decisionTakenAt: screeningDate } : {}) },
    });
    await prisma.instructor_screening.updateMany({
        where: { studentId: student.id },
        data: { createdAt: screeningDate, ...(instructor && instructor !== 'pending' && instructor !== 'wannabe' ? { decisionTakenAt: screeningDate } : {}) },
    });

    if (data.screeningAppointmentInDays !== undefined) {
        const tutorScreening = tutor === 'pending' ? await prisma.screening.findUnique({ where: { studentId: student.id } }) : null;
        const instructorScreening = instructor === 'pending' ? await prisma.instructor_screening.findUnique({ where: { studentId: student.id } }) : null;
        const start = workdayAt(data.screeningAppointmentInDays, '16:00');
        await createScreeningAppointment({
            start,
            duration: 30,
            title: 'Kennenlerngespräch (Helfer:in)',
            screener,
            participant: userForStudent(student),
            tutorScreeningId: tutorScreening?.id,
            instructorScreeningId: instructorScreening?.id,
        });
    }

    await prisma.student.update({
        where: { id: student.id },
        data: {
            createdAt: daysFromNow(-registeredDaysAgo),
            calendarPreferences: calendarPreferences as Record<string, any>,
            hasDoneEthicsOnboarding: data.hasDoneEthicsOnboarding ?? hadSuccessfulScreening,
            zoomUserId: data.zoomUserId,
        },
    });
    return refetchStudent(student);
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     Appointments                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

interface CreateLecturesArgs {
    dates: Date[];
    durationMinutes?: number;
    organizerIds: string[];
    participantIds: string[];
    subcourseId?: number;
    matchId?: number;
    /** From this appointment on the participants don't show up anymore (e.g. a pupil ghosting the tutor) */
    participantsAbsentFromIndex?: number;
    /** Everybody joins every past appointment for exactly `durationMinutes - 10` minutes, so the numbers are predictable */
    fullAttendance?: boolean;
    /** Upcoming appointments are canceled (e.g. the course was cancelled) */
    cancelled?: boolean;
}

const createLectures = async ({
    dates,
    durationMinutes = 60,
    organizerIds,
    participantIds,
    subcourseId,
    matchId,
    participantsAbsentFromIndex,
    fullAttendance = false,
    cancelled = false,
}: CreateLecturesArgs) => {
    const now = new Date();

    for (let index = 0; index < dates.length; index++) {
        const start = dates[index];
        const isPast = start <= now;
        const participantsAbsent = participantsAbsentFromIndex !== undefined && index >= participantsAbsentFromIndex;
        // Occasionally somebody misses an appointment
        const attending = participantIds.filter((_, p) => isPast && !participantsAbsent && (fullAttendance || (index + 2 * p) % 7 !== 6));

        const lecture = await prisma.lecture.create({
            data: {
                subcourseId,
                matchId,
                duration: durationMinutes,
                start,
                organizerIds,
                participantIds,
                isCanceled: cancelled && !isPast,
                joinedBy: isPast ? [...organizerIds, ...attending] : [],
                // Only tracked for match appointments
                actualDuration: fullAttendance ? (isPast ? durationMinutes - 10 : 0) : matchId && attending.length ? durationMinutes - (index % 4) * 3 : 0,
                appointmentType: subcourseId ? 'group' : 'match',
            },
        });

        if (matchId) {
            if (isPast && attending.length && index % 3 === 0) {
                await createLectureFeedback(lecture, {
                    status: 'submitted',
                    rating: (index % 5) + 1,
                    tags: ['Sonstiges: Lorem ipsum dolor sit amet, consetetur sadipscing elitr'],
                });
            } else {
                await createLectureFeedback(lecture);
            }
        }
    }
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        Matches                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

interface CreateTutoringMatchArgs {
    pupil: Pupil;
    student: Student;
    /** Weekly tutoring appointments, past ones are held, future ones are upcoming */
    schedule: WeeklySchedule | Date[];
    durationMinutes?: number;
    topics?: {
        name: string;
        subject: CourseSubject;
        assignments: {
            status: learning_assignment_status;
            task: string;
        }[];
    }[];
    participantsAbsentFromIndex?: number;
    fullAttendance?: boolean;
    /** Dissolves the match after the appointments, so the schedule must end before `daysAgo` */
    dissolve?: { by: DissolvedBy; reasons: DissolveReason[]; daysAgo: number };
}

const createTutoringMatch = async (data: CreateTutoringMatchArgs) => {
    const { topics = [], schedule } = data;
    const dates = datesOf(schedule);

    await createPupilMatchRequest(data.pupil, true);
    await createStudentMatchRequest(data.student, true);
    const match = await createMatch(await refetchPupil(data.pupil), await refetchStudent(data.student), TEST_POOL, { skipChatCreation: true });

    // The match was created a few days before the first appointment, and the partners requested it a bit earlier
    const matchedAt = new Date(dates[0].getTime() - 3 * DAY_MS);
    await prisma.match.update({
        where: { id: match.id },
        data: {
            createdAt: matchedAt,
            pupilFirstMatchRequest: new Date(matchedAt.getTime() - 5 * DAY_MS),
            studentFirstMatchRequest: new Date(matchedAt.getTime() - 9 * DAY_MS),
            didHaveMeeting: dates[0] < new Date(),
        },
    });

    await createLectures({
        dates,
        durationMinutes: data.durationMinutes,
        participantIds: [`pupil/${data.pupil.id}`],
        organizerIds: [`student/${data.student.id}`],
        matchId: match.id,
        participantsAbsentFromIndex: data.participantsAbsentFromIndex,
        fullAttendance: data.fullAttendance,
    });

    for (const topic of topics) {
        const createdTopic = await prisma.learning_topic.create({
            data: {
                matchId: match.id,
                name: topic.name,
                subject: topic.subject,
                pupilId: match.pupilId,
            },
        });
        for (const assignment of topic.assignments) {
            await prisma.learning_assignment.create({
                data: {
                    status: assignment.status,
                    task: assignment.task,
                    topicId: createdTopic.id,
                },
            });
        }
    }

    if (data.dissolve) {
        const { by, reasons, daysAgo } = data.dissolve;
        await dissolveMatch(match, reasons, by === 'pupil' ? data.pupil : by === 'student' ? data.student : null, by);
        await prisma.match.update({ where: { id: match.id }, data: { dissolvedAt: daysFromNow(-daysAgo) } });
    }

    return match;
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        Courses                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

interface CreateCourseArgs {
    name: string;
    outline?: string;
    description: string;
    category: CourseCategory;
    state: CourseState;
    subject?: CourseSubject;
    tag?: { id: number };
    allowContact?: boolean;
    joinAfterStart?: boolean;
    minGrade?: number;
    maxGrade?: number;
    maxParticipants?: number;
    /** Defaults to true for allowed courses */
    published?: boolean;
    cancelled?: boolean;
    allowMentoring?: boolean;
    screeningComment?: string;
    instructors: Student[];
    mentors?: Student[];
    participants: Pupil[];
    waitingList?: Pupil[];
    /** No schedule means a draft without appointments */
    schedule?: WeeklySchedule | Date[];
    fullAttendance?: boolean;
    durationMinutes?: number;
}

const createCourse = async (data: CreateCourseArgs) => {
    const dates = data.schedule ? datesOf(data.schedule) : [];
    const published = data.published ?? data.state === CourseState.allowed;
    const mentors = data.mentors ?? [];

    const course = await prisma.course.create({
        data: {
            name: data.name,
            outline: data.outline ?? '',
            description: data.description,
            category: data.category,
            courseState: data.state,
            subject: data.subject,
            allowContact: data.allowContact ?? true,
            screeningComment: data.screeningComment,
            course_tags_course_tag: data.tag ? { create: { courseTagId: data.tag.id } } : undefined,
        },
    });
    const subcourse = await prisma.subcourse.create({
        data: {
            courseId: course.id,
            joinAfterStart: data.joinAfterStart ?? true,
            minGrade: data.minGrade ?? 1,
            maxGrade: data.maxGrade ?? 14,
            maxParticipants: data.maxParticipants ?? 10,
            published,
            publishedAt: published ? new Date(Math.min((dates[0]?.getTime() ?? Date.now()) - 10 * DAY_MS, Date.now() - 2 * DAY_MS)) : null,
            cancelled: data.cancelled ?? false,
            allowMentoring: data.allowMentoring,
        },
    });

    await createLectures({
        dates,
        durationMinutes: data.durationMinutes,
        subcourseId: subcourse.id,
        participantIds: [...data.participants.map((p) => `pupil/${p.id}`), ...mentors.map((m) => `student/${m.id}`)],
        organizerIds: data.instructors.map((e) => `student/${e.id}`),
        fullAttendance: data.fullAttendance,
        cancelled: data.cancelled,
    });

    // Add Instructors, Mentors and Participants after adding Lectures, so that they are also added to the lectures:
    await addCourseInstructor(null, course, data.instructors[0]);
    for (const instructor of data.instructors) {
        await addSubcourseInstructor(null, subcourse, instructor);
    }
    for (const mentor of mentors) {
        await addSubcourseMentor(userForStudent(mentor), subcourse, mentor, true);
    }
    for (const participant of data.participants) {
        await joinSubcourse(subcourse, participant, false, false);
    }
    for (const pupil of data.waitingList ?? []) {
        await joinSubcourseWaitinglist(subcourse, pupil);
    }
    return [course, subcourse] as const;
};

const createScreener = async (
    n: number,
    data: { firstname: string; lastname: string; course?: boolean; pupil?: boolean; student?: boolean; trusted?: boolean }
) => {
    const screener = await prisma.screener.create({
        data: {
            firstname: data.firstname,
            lastname: data.lastname,
            email: `test+dev+sc${n}@lern-fair.de`,
            password: 'LEGACY',
            verified: true,
            active: true,
            is_course_screener: data.course ?? false,
            is_pupil_screener: data.pupil ?? false,
            is_student_screener: data.student ?? false,
            is_trusted: data.trusted ?? false,
        },
    });
    await _createFixedToken(userForScreener(screener), `authtokenSC${n}`);
    await createPassword(userForScreener(screener), `test`);
    return screener;
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                           Internship certificate fixture                                           */
/* ------------------------------------------------------------------------------------------------------------------ */

/**
 * Uni cooperation student with a one month internship (-42d to -12d) and a known set of lectures (15:00 each, offsets in days from today):
 * a few before the internship, most of them during it and a few after it, one of the match lectures is still upcoming.
 */
const createInternshipCertificateFixture = async (screener: Screener) => {
    const student = await createStudent(
        {
            firstname: 'Ina',
            lastname: 'HuH',
            email: 'test+dev+s21@lern-fair.de',
            aboutMe: `I'm Student 21, my lectures are known so certificates can be tested`,
            cooperationTag: 'uni-freiburg',
            languages: ['Deutsch'],
            subjects: [subject('Mathematik', 1, 13)],
            tutor: 'success',
            instructor: 'success',
            coc: true,
            registeredDaysAgo: 150,
        },
        screener
    );
    // The screening already created an internship for the current semester, replace it with the fixed period
    await prisma.internship.updateMany({ where: { studentId: student.id }, data: { status: 'in_progress', startDate: dayAt(-42, 0), endDate: dayAt(-12, 0) } });

    const newPupil = (firstname: string, lastname: string, email: string) =>
        createPupil({
            firstname,
            lastname,
            email,
            aboutMe: 'Pupil for internship certificate testing',
            languages: ['Deutsch'],
            subjects: [{ name: 'Mathematik', mandatory: true }],
            gradeAsInt: 6,
            registeredDaysAgo: 130,
        });
    const lukas = await newPupil('Lukas', 'SuS IN', 'test+dev+p15@lern-fair.de');
    const mia = await newPupil('Mia', 'SuS IN', 'test+dev+p16@lern-fair.de');
    const at = (offsets: number[]) => offsets.map((offset) => dayAt(offset));

    // Twice a week: 2 lectures before the internship, 9 during it (the last one on its final day), 3 after it and 1 upcoming
    await createTutoringMatch({
        pupil: lukas,
        student,
        schedule: at([-47, -43, -40, -37, -33, -30, -26, -23, -19, -16, -12, -9, -5, -2, 2]),
        fullAttendance: true,
    });
    // Weekly: 1 lecture before, 4 during, 1 after and 1 upcoming
    await createTutoringMatch({ pupil: mia, student, schedule: at([-45, -34, -27, -20, -13, -6, 1]), fullAttendance: true });

    const common: Pick<CreateCourseArgs, 'category' | 'state' | 'instructors' | 'fullAttendance'> = {
        category: CourseCategory.revision,
        state: CourseState.allowed,
        instructors: [student],
        fullAttendance: true,
    };
    await createCourse({
        ...common,
        name: 'Zertifikat: Kurs A (Praktikum)',
        description: 'Course only during the internship, 1 participant',
        participants: [lukas],
        schedule: at([-39, -32, -25, -18]),
    });
    await createCourse({
        ...common,
        name: 'Zertifikat: Kurs B (danach)',
        description: 'Course only after the internship, 1 participant',
        participants: [mia],
        schedule: at([-8, -3]),
    });
    await createCourse({
        ...common,
        name: 'Zertifikat: Hausaufgabenhilfe',
        description: 'Homework help, 1 lecture before the internship, 4 during it and 2 after it',
        category: CourseCategory.homework_help,
        participants: [],
        schedule: at([-44, -38, -31, -24, -17, -10, -4]),
    });
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                         Seed                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

void (async function setupDevDB() {
    if (!isDev && !isTest) {
        throw new Error(`Are you sure you want to seed the DB in a non development / test environment?`);
    }

    if ((await prisma.pupil.count()) > 0) {
        throw new Error(`Cannot seed a non empty database. Use npm run db:reset-hard to drop it`);
    }

    logger.info('Starting to Seed DB');

    _setSilenceNotificationSystem(true);

    await prisma.cooperation.createMany({
        data: [
            {
                name: 'Lern-Fair e.V.',
                tag: 'self',
                type: 'company',
                welcomeTitle: 'Wilkommen im Userbereich',
                welcomeMessage: 'Als Lern-Fairer kennst du dich ja hier aus :)',
            },
            ...[
                { name: 'Uni Freiburg', tag: 'uni-freiburg' },
                { name: 'Uni CSS', tag: 'uni-css' },
                { name: 'Uni ABC', tag: 'uni-abc' },
                { name: 'Uni JS', tag: 'uni-js' },
            ].map((uni) => ({
                ...uni,
                type: 'university' as const,
                welcomeTitle: 'Wilkommen im Userbereich',
                welcomeMessage: 'Lorem ipsum dolor sit amet',
            })),
        ],
    });

    /* ---------------------------------------------------- Screeners --------------------------------------------------- */

    const screener1 = await createScreener(1, { firstname: 'Alina', lastname: 'Screenerfrau', course: true, pupil: true, student: true, trusted: true });
    await createScreener(2, { firstname: 'Lina', lastname: 'Screenerfrau', course: true });
    const pupilScreener = await createScreener(3, { firstname: 'Leto', lastname: 'Atreides', pupil: true });
    const studentScreener = await createScreener(4, { firstname: 'Paul', lastname: 'Atreides', student: true });

    /* ----------------------------------------------------- Pupils ----------------------------------------------------- */

    // Tutoring + courses + Hausaufgabenhilfe, two active matches in different subjects
    const max = await createPupil({
        firstname: 'Max',
        lastname: 'SuS',
        email: 'test+dev+p1@lern-fair.de',
        aboutMe: 'Hallo 👋! Ich heiße Max und ich interessiere mich für Englisch und Mathe',
        languages: ['Deutsch', 'Italienisch'],
        subjects: [{ name: 'Englisch' }, { name: 'Mathematik', mandatory: true }],
        gradeAsInt: 6,
        calendarPreferences: availability(ALL_WEEK),
        registeredDaysAgo: 100,
    });

    // Tutoring + courses + Hausaufgabenhilfe, two active matches in different subjects
    const tom = await createPupil({
        firstname: 'Tom',
        lastname: 'SuS',
        email: 'test+dev+p2@lern-fair.de',
        aboutMe: 'Hallo, ich bin Tom und ich lerne Deutsch!',
        languages: ['Englisch'],
        subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }, { name: 'Mathematik' }],
        gradeAsInt: 6,
        calendarPreferences: availability(MON_FRI, 12, 21),
        registeredDaysAgo: 100,
    });

    // Can only participate in courses (no tutoring)
    const aisha = await createPupil({
        firstname: 'Aisha',
        lastname: 'SuS',
        email: 'test+dev+p3@lern-fair.de',
        aboutMe: 'Hi, ich bin Aisha und ich liebe Mathe und Biologie!',
        languages: ['Deutsch', 'Franz_sisch'],
        subjects: [{ name: 'Mathematik', mandatory: true }, { name: 'Biologie' }, { name: 'Französisch' }, { name: 'Englisch' }],
        gradeAsInt: 6,
        isPupil: false,
        calendarPreferences: availability(MON_SAT, 10, 12),
        registeredDaysAgo: 90,
    });

    // DAZ_SUBJECT_REQUIRED_FOR_MATCHING, has a match, one other course and the Hausaufgabenhilfe
    const lena = await createPupil({
        firstname: 'Lena',
        lastname: 'SuS',
        email: 'test+dev+p4@lern-fair.de',
        aboutMe: "I'm Lena, and I want to improve my German",
        languages: ['Englisch', 'Spanisch'],
        subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }],
        gradeAsInt: 7,
        learningOfferConstraints: ['DAZ_SUBJECT_REQUIRED_FOR_MATCHING'],
        calendarPreferences: availability(['monday', 'friday'], 10, 15),
        registeredDaysAgo: 95,
    });

    // ONLY_DAZ_COURSES: can only join (and only participates in) German language courses, no tutoring
    const sofia = await createPupil({
        firstname: 'Sofia',
        lastname: 'SuS',
        email: 'test+dev+p5@lern-fair.de',
        aboutMe: 'Ich bin Sofia und ich interessiere mich sehr für Deutsch und Englisch.',
        languages: ['Italienisch'],
        subjects: [
            { name: 'Deutsch als Zweitsprache', mandatory: true },
            { name: 'Englisch', mandatory: true },
        ],
        gradeAsInt: 5,
        isPupil: false,
        learningOfferConstraints: ['ONLY_DAZ_COURSES'],
        registeredDaysAgo: 80,
    });

    // New pupil: successfully screened, nothing else yet
    await createPupil({
        firstname: 'Yusuf',
        lastname: 'SuS',
        email: 'test+dev+p6@lern-fair.de',
        aboutMe: 'Moin, ich heiße Yusuf und ich liebe Mathe und Chemie',
        languages: ['T_rkisch', 'Englisch', 'Deutsch'],
        subjects: [{ name: 'Mathematik', mandatory: true }, { name: 'Chemie' }],
        gradeAsInt: 10,
        registeredDaysAgo: 5,
    });

    // Match dissolved (by her), new match request open, valid screening, participates in courses
    const emilia = await createPupil({
        firstname: 'Emilia',
        lastname: 'SuS',
        email: 'test+dev+p7@lern-fair.de',
        aboutMe: 'Ich bin Emilia und ich lese gerne Bücher und liebe Englisch.',
        languages: ['Deutsch'],
        subjects: [{ name: 'Mathematik', mandatory: true }, { name: 'Englisch' }],
        gradeAsInt: 4,
        registeredDaysAgo: 100,
    });

    // Match dissolved because he ghosted (screening was invalidated), new match request open,
    // new screening appointment booked, participates in courses
    const diego = await createPupil({
        firstname: 'Diego',
        lastname: 'SuS',
        email: 'test+dev+p8@lern-fair.de',
        aboutMe: "I'm Diego, and I enjoy learning about math and science.",
        languages: ['Spanisch', 'Englisch'],
        subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }, { name: 'Mathematik' }, { name: 'Englisch' }],
        gradeAsInt: 6,
        registeredDaysAgo: 100,
    });

    // New pupil: not screened yet, but booked the screening appointment
    await createPupil({
        firstname: 'Sarah',
        lastname: 'SuS',
        email: 'test+dev+p9@lern-fair.de',
        aboutMe: 'Hallo, ich bin Sarah und Mathe ist mein Lieblingsfach!',
        languages: ['Deutsch', 'Englisch'],
        subjects: [{ name: 'Mathematik', mandatory: true }, { name: 'Biologie' }, { name: 'Englisch' }],
        gradeAsInt: 10,
        screening: 'pending',
        screeningAppointment: { inDays: 4, screener: pupilScreener },
        registeredDaysAgo: 4,
    });

    // Without password (login only via token / password reset), match dissolved by an admin
    const mateo = await createPupil({
        firstname: 'Mateo',
        lastname: 'SuS',
        email: 'test+dev+p10@lern-fair.de',
        aboutMe: "I'm Mateo, and I'm working on improving my German skills",
        languages: ['Spanisch', 'Englisch'],
        subjects: [
            { name: 'Deutsch als Zweitsprache', mandatory: true },
            { name: 'Mathematik', mandatory: true },
        ],
        gradeAsInt: 4,
        includePassword: false,
        registeredDaysAgo: 110,
    });

    // Tutoring, one of Leon's four matches (Mathe)
    const noah = await createPupil({
        firstname: 'Noah',
        lastname: 'SuS',
        email: 'test+dev+p11@lern-fair.de',
        aboutMe: 'Hi, ich bin Noah und brauche Hilfe in Mathe.',
        languages: ['Deutsch'],
        subjects: [{ name: 'Mathematik', mandatory: true }],
        gradeAsInt: 8,
        registeredDaysAgo: 70,
    });

    // Tutoring, one of Leon's four matches (DaZ)
    const olivia = await createPupil({
        firstname: 'Olivia',
        lastname: 'SuS',
        email: 'test+dev+p12@lern-fair.de',
        aboutMe: 'Ich bin Olivia und lerne Deutsch.',
        languages: ['Englisch'],
        subjects: [{ name: 'Deutsch als Zweitsprache', mandatory: true }],
        gradeAsInt: 5,
        registeredDaysAgo: 70,
    });

    // Tutoring, one of Leon's four matches (Spanisch)
    const finn = await createPupil({
        firstname: 'Finn',
        lastname: 'SuS',
        email: 'test+dev+p13@lern-fair.de',
        aboutMe: 'Hola, ich bin Finn und möchte mein Spanisch verbessern.',
        languages: ['Deutsch'],
        subjects: [{ name: 'Spanisch', mandatory: true }],
        gradeAsInt: 9,
        registeredDaysAgo: 70,
    });

    // Tutoring, Melanie's second match (Französisch)
    const zoe = await createPupil({
        firstname: 'Zoe',
        lastname: 'SuS',
        email: 'test+dev+p14@lern-fair.de',
        aboutMe: 'Salut, ich bin Zoe und Französisch ist mein Problemfach.',
        languages: ['Deutsch'],
        subjects: [{ name: 'Französisch', mandatory: true }],
        gradeAsInt: 7,
        registeredDaysAgo: 70,
    });

    /* ---------------------------------------------------- Students ---------------------------------------------------- */

    const newStudent = (args: CreateStudentArgs) => createStudent(args, studentScreener);

    // Tutor + instructor, instructs most courses and the Hausaufgabenhilfe, four active matches and still waiting for another pupil
    const leon = await createStudent(
        {
            firstname: 'Leon',
            lastname: 'HuH',
            email: 'test+dev+s1@lern-fair.de',
            aboutMe: `Im Student 1`,
            languages: ['Deutsch', 'Englisch', 'Spanisch'],
            subjects: [
                subject('Spanisch', 4, 10),
                subject('Deutsch als Zweitsprache', 4, 10),
                subject('Englisch', 4, 10),
                subject('Deutsch', 4, 10),
                subject('Mathematik', 4, 10),
            ],
            tutor: 'success',
            instructor: 'success',
            coc: true,
            calendarPreferences: availability(ALL_WEEK),
            registeredDaysAgo: 400,
        },
        screener1
    );

    // Tutor + instructor with a Zoom account, two active matches
    const melanie = await createStudent(
        {
            firstname: 'Melanie',
            lastname: 'HuH',
            aboutMe: `Im Student 2`,
            email: 'test+dev+s2@lern-fair.de',
            newsletter: false,
            languages: ['Deutsch', 'Englisch', 'Franz_sisch'],
            subjects: [subject('Deutsch als Zweitsprache'), subject('Französisch'), subject('Mathematik'), subject('Englisch')],
            tutor: 'success',
            instructor: 'success',
            coc: true,
            zoomUserId: 'kLKyaiAyTNC-MWjiWCFFFF',
            registeredDaysAgo: 400,
        },
        screener1
    );

    // Tutor + instructor, no match yet
    const jon = await createStudent(
        {
            firstname: 'Jon',
            lastname: 'HuH',
            email: 'test+dev+s3@lern-fair.de',
            aboutMe: `I'm Student 3`,
            languages: ['Deutsch', 'Englisch', 'Franz_sisch'],
            subjects: [subject('Französisch', 4, 10), subject('Englisch'), subject('Rechnungswesen', 14, 14)],
            tutor: 'success',
            instructor: 'success',
            coc: true,
            registeredDaysAgo: 300,
        },
        screener1
    );

    // Instructor only, no tutoring
    const jack = await createStudent(
        {
            firstname: 'Jack',
            lastname: 'HuH',
            email: 'test+dev+s4@lern-fair.de',
            aboutMe: `I'm Student 4`,
            newsletter: false,
            instructor: 'success',
            coc: true,
            registeredDaysAgo: 250,
        },
        screener1
    );

    // Tutor only, registered through our own organisation, waiting for a match
    const jane = await createStudent(
        {
            firstname: 'Jane',
            lastname: 'HuH',
            email: 'test+dev+s5@lern-fair.de',
            aboutMe: `I'm Student 5`,
            cooperationTag: 'self',
            languages: ['Englisch', 'Arabisch', 'Deutsch'],
            subjects: [subject('Französisch'), subject('Mathematik', 1, 10), subject('Biologie', 1, 10)],
            tutor: 'success',
            coc: true,
            registeredDaysAgo: 200,
        },
        screener1
    );

    // Cooperation student (Uni Freiburg) with a running internship, only tutors DaZ
    const hannah = await newStudent({
        firstname: 'Hannah',
        lastname: 'HuH',
        email: 'test+dev+s6@lern-fair.de',
        aboutMe: `I'm Student 6, I only support in DaZ`,
        cooperationTag: 'uni-freiburg',
        languages: ['Deutsch', 'Englisch'],
        subjects: [subject('Deutsch als Zweitsprache')],
        supportsInDaZ: true,
        tutor: 'success',
        coc: true,
        internship: 'in_progress',
        registeredDaysAgo: 150,
    });

    // Cooperation student (Uni CSS) with a running internship, only tutors Mathe
    const ben = await newStudent({
        firstname: 'Ben',
        lastname: 'HuH',
        email: 'test+dev+s7@lern-fair.de',
        aboutMe: `I'm Student 7, I only support in Mathe`,
        cooperationTag: 'uni-css',
        languages: ['Deutsch', 'Englisch'],
        subjects: [subject('Mathematik', 1, 10)],
        tutor: 'success',
        coc: true,
        internship: 'in_progress',
        calendarPreferences: availability(MON_FRI, 15, 21),
        registeredDaysAgo: 140,
    });

    // Cooperation student (Uni ABC) whose internship is over, so their match was dissolved by an admin
    const clara = await newStudent({
        firstname: 'Clara',
        lastname: 'HuH',
        email: 'test+dev+s8@lern-fair.de',
        aboutMe: `I'm Student 8, my internship is over`,
        cooperationTag: 'uni-abc',
        languages: ['Deutsch', 'Spanisch'],
        subjects: [subject('Deutsch als Zweitsprache'), subject('Mathematik')],
        supportsInDaZ: true,
        tutor: 'success',
        coc: true,
        internship: 'completed',
        registeredDaysAgo: 200,
    });

    // Tutor whose match was dissolved by the pupil, now waiting for a new match
    const felix = await newStudent({
        firstname: 'Felix',
        lastname: 'HuH',
        email: 'test+dev+s9@lern-fair.de',
        aboutMe: `I'm Student 9, my last match was dissolved`,
        languages: ['Deutsch', 'Englisch'],
        subjects: [subject('Mathematik'), subject('Englisch')],
        tutor: 'success',
        coc: true,
        registeredDaysAgo: 150,
    });

    // Tutor whose match was dissolved because the pupil ghosted
    const greta = await newStudent({
        firstname: 'Greta',
        lastname: 'HuH',
        email: 'test+dev+s10@lern-fair.de',
        aboutMe: `I'm Student 10, my pupil ghosted me`,
        languages: ['Deutsch', 'Spanisch'],
        subjects: [subject('Deutsch als Zweitsprache'), subject('Mathematik')],
        supportsInDaZ: true,
        tutor: 'success',
        coc: true,
        registeredDaysAgo: 150,
    });

    // Tutor that mentors in the Hausaufgabenhilfe
    const nina = await newStudent({
        firstname: 'Nina',
        lastname: 'HuH',
        email: 'test+dev+s11@lern-fair.de',
        aboutMe: `I'm Student 11, I mentor in the Hausaufgabenhilfe`,
        languages: ['Deutsch', 'Englisch'],
        subjects: [subject('Mathematik'), subject('Physik')],
        tutor: 'success',
        coc: true,
        registeredDaysAgo: 120,
    });

    // Cooperation student (Uni JS) with a cancelled internship, mentors in the Hausaufgabenhilfe
    const omar = await newStudent({
        firstname: 'Omar',
        lastname: 'HuH',
        email: 'test+dev+s12@lern-fair.de',
        aboutMe: `I'm Student 12, I mentor in the Hausaufgabenhilfe`,
        cooperationTag: 'uni-js',
        languages: ['Deutsch', 'Arabisch', 'Englisch'],
        subjects: [subject('Informatik'), subject('Englisch')],
        tutor: 'success',
        coc: true,
        internship: 'cancelled',
        registeredDaysAgo: 110,
    });

    // Instructor only, instructs a course that is still upcoming and a denied one
    const paula = await newStudent({
        firstname: 'Paula',
        lastname: 'HuH',
        email: 'test+dev+s13@lern-fair.de',
        aboutMe: `I'm Student 13, I only give courses`,
        instructor: 'success',
        coc: true,
        registeredDaysAgo: 100,
    });

    // Instructor only, has a cancelled course and a draft
    const quentin = await newStudent({
        firstname: 'Quentin',
        lastname: 'HuH',
        email: 'test+dev+s14@lern-fair.de',
        aboutMe: `I'm Student 14, I only give courses`,
        cooperationTag: 'uni-freiburg',
        instructor: 'success',
        coc: true,
        registeredDaysAgo: 100,
    });

    // Tutor + instructor screenings pending, appointment booked next week
    await newStudent({
        firstname: 'Rita',
        lastname: 'HuH',
        email: 'test+dev+s15@lern-fair.de',
        aboutMe: `I'm Student 15, my screening is booked`,
        languages: ['Deutsch', 'Englisch'],
        subjects: [subject('Englisch'), subject('Deutsch')],
        tutor: 'pending',
        instructor: 'pending',
        screeningAppointmentInDays: 6,
        registeredDaysAgo: 8,
    });

    // Tutor + instructor screenings pending, appointments booked in the next days / weeks
    await newStudent({
        firstname: 'Sam',
        lastname: 'HuH',
        email: 'test+dev+s16@lern-fair.de',
        aboutMe: `I'm Student 16, my screening is booked`,
        languages: ['Deutsch', 'Englisch'],
        subjects: [subject('Mathematik')],
        tutor: 'pending',
        instructor: 'pending',
        screeningAppointmentInDays: 3,
        registeredDaysAgo: 12,
    });

    await newStudent({
        firstname: 'Tessa',
        lastname: 'HuH',
        email: 'test+dev+s17@lern-fair.de',
        aboutMe: `I'm Student 17, my screening is booked`,
        languages: ['Deutsch', 'Englisch'],
        subjects: [subject('Biologie'), subject('Chemie')],
        tutor: 'pending',
        instructor: 'pending',
        screeningAppointmentInDays: 8,
        registeredDaysAgo: 1,
    });

    await newStudent({
        firstname: 'Uwe',
        lastname: 'HuH',
        email: 'test+dev+s18@lern-fair.de',
        aboutMe: `I'm Student 18, my screening is booked`,
        languages: ['Deutsch'],
        subjects: [subject('Deutsch'), subject('Geschichte')],
        tutor: 'pending',
        instructor: 'pending',
        screeningAppointmentInDays: 10,
        registeredDaysAgo: 6,
    });

    await newStudent({
        firstname: 'Vera',
        lastname: 'HuH',
        email: 'test+dev+s19@lern-fair.de',
        aboutMe: `I'm Student 19, my screening is booked`,
        languages: ['Deutsch'],
        subjects: [subject('Mathematik')],
        tutor: 'pending',
        instructor: 'pending',
        screeningAppointmentInDays: 2,
        registeredDaysAgo: 40,
    });
    // Just got screened as tutor: no Certificate of Conduct yet (gets reminders) and did not do the onboarding yet
    const walter = await newStudent({
        firstname: 'Walter',
        lastname: 'HuH',
        email: 'test+dev+s20@lern-fair.de',
        aboutMe: `I'm Student 20, I just got screened`,
        languages: ['Deutsch', 'Englisch'],
        subjects: [subject('Englisch'), subject('Mathematik')],
        tutor: 'success',
        hasDoneEthicsOnboarding: false,
        registeredDaysAgo: 2,
    });

    /* ----------------------------------------------------- Matches ----------------------------------------------------- */

    // Max has two matches in different subjects
    await createTutoringMatch({
        pupil: max,
        student: ben,
        schedule: { weekdays: [2], time: '16:00', firstWeek: -6, weeks: 10 },
        topics: [
            {
                name: 'Nullstellenbestimmung',
                subject: 'Mathematik',
                assignments: [
                    { status: 'pending', task: 'Bestimme die Nullstellen der Funktion f(x) = x ** 2 - 9' },
                    { status: 'pending', task: 'Bestimme die Nullstellen der Funktion f(x) = x ** 2 - 6x + 9' },
                ],
            },
        ],
    });

    // Leon has four matches in total (Max, Noah, Olivia, Finn)
    await createTutoringMatch({
        pupil: max,
        student: leon,
        schedule: { weekdays: [5], time: '16:00', firstWeek: -3, weeks: 7, skipWeeks: [-1] },
        topics: [
            {
                name: 'Simple Past',
                subject: 'Englisch',
                assignments: [{ status: 'pending', task: "Übersetze 'Ich ging gestern zur Schule' ins Englische" }],
            },
        ],
    });
    await createTutoringMatch({ pupil: noah, student: leon, schedule: { weekdays: [6], time: '10:00', firstWeek: -4, weeks: 8 } });
    await createTutoringMatch({ pupil: olivia, student: leon, schedule: { weekdays: [2], time: '14:00', firstWeek: -5, weeks: 9 } });
    await createTutoringMatch({ pupil: finn, student: leon, schedule: { weekdays: [1], time: '15:30', firstWeek: -3, weeks: 7 } });

    // Tom has two matches in different subjects
    await createTutoringMatch({ pupil: tom, student: hannah, schedule: { weekdays: [1, 4], time: '15:00', firstWeek: -4, weeks: 8 } });
    await createTutoringMatch({ pupil: tom, student: ben, schedule: { weekdays: [2], time: '19:00', firstWeek: -2, weeks: 6 } });

    // Melanie has two (Lena, Zoe)
    await createTutoringMatch({ pupil: zoe, student: melanie, schedule: { weekdays: [5], time: '14:00', firstWeek: -3, weeks: 7 } });
    await createTutoringMatch({ pupil: lena, student: melanie, schedule: { weekdays: [1], time: '14:00', firstWeek: -5, weeks: 9 } });

    // Emilia dissolved her match three weeks ago and asked for a new one
    await createTutoringMatch({
        pupil: emilia,
        student: felix,
        schedule: { weekdays: [1], time: '16:00', firstWeek: -9, weeks: 5 },
        dissolve: { by: 'pupil', reasons: ['scheduleIssues'], daysAgo: 21 },
    });
    await createPupilMatchRequest(await refetchPupil(emilia), true);
    await createStudentMatchRequest(await refetchStudent(felix), true);

    // Diego stopped showing up, so Greta dissolved the match; Diego has to do a new screening before he gets a new match
    await createTutoringMatch({
        pupil: diego,
        student: greta,
        schedule: { weekdays: [5], time: '15:00', firstWeek: -10, weeks: 5 },
        participantsAbsentFromIndex: 3,
        dissolve: { by: 'student', reasons: ['ghosted'], daysAgo: 35 },
    });
    await bookPupilScreening(diego, 9, pupilScreener);
    await createPupilMatchRequest(await refetchPupil(diego), true);

    // Clara's internship ended, so an admin dissolved the match
    await createTutoringMatch({
        pupil: mateo,
        student: clara,
        schedule: { weekdays: [6], time: '10:00', firstWeek: -12, weeks: 8 },
        dissolve: { by: 'admin', reasons: ['internshipEnded'], daysAgo: 28 },
    });

    // Tutors waiting for a pupil
    await createStudentMatchRequest(await refetchStudent(leon), true);
    await createStudentMatchRequest(await refetchStudent(jane), true);

    /* ----------------------------------------------------- Courses ----------------------------------------------------- */

    const keepAtIt = await createCourseTag(null, 'Dranbleiben', CourseCategory.focus);
    await createCourseTag(null, 'Denk an Dich', CourseCategory.focus);
    const yourFuture = await createCourseTag(null, 'Deine Zukunft', CourseCategory.focus);
    const digitalWorld = await createCourseTag(null, 'Digitale Welt', CourseCategory.focus);
    await createCourseTag(null, 'Für Eltern', CourseCategory.focus);
    const a1 = await createCourseTag(null, 'A1', CourseCategory.language);
    const a2 = await createCourseTag(null, 'A2', CourseCategory.language);
    await createCourseTag(null, 'B1', CourseCategory.language);

    const emptyCourseData = {
        name: 'Do not remove me',
        outline: '',
        description: "I'm here just to make sure course ids and subcourse ids are not equal This helps us to simulate a bit better how production works",
        category: 'coaching',
        courseState: 'created',
        subject: 'Informatik',
        allowContact: false,
    } as const;

    const emptyCourses = Array.from({ length: 10 }).fill(emptyCourseData) as Array<typeof emptyCourseData>;
    await prisma.course.createMany({
        data: emptyCourses,
    });

    // Ongoing: started three weeks ago, runs for five more weeks
    await createCourse({
        name: 'Deutsch Grammatik für Anfänger 📚',
        outline: 'Grundlagen der deutschen Grammatik, Satzbau, Zeiten und Rechtschreibung.',
        description:
            'Lerne die Grundlagen der deutschen Sprache! 🧠 Mit einfachen Übungen und vielen Beispielen wirst du schnell die Regeln verstehen. Gemeinsam schauen wir uns Satzbau, Wortarten und Rechtschreibung an. Deutsch ist gar nicht so schwer, wenn man es spielerisch lernt! 😊',
        category: CourseCategory.language,
        state: CourseState.allowed,
        subject: 'Deutsch_als_Zweitsprache',
        tag: a1,
        maxParticipants: 10,
        instructors: [leon],
        participants: [lena, sofia, diego, mateo],
        schedule: { weekdays: [2, 4], time: '16:00', firstWeek: -3, weeks: 8 },
    });

    // Ongoing and full, with someone on the waiting list
    await createCourse({
        name: 'Gesprächskurs Deutsch 💬',
        outline: 'Sprechen, Zuhören und Alltagsgespräche üben.',
        description:
            'In diesem Kurs üben wir das freie Sprechen auf Deutsch. 🎙️ Du lernst, dich in alltäglichen Situationen sicher auszudrücken und verstehst, wie man höflich und freundlich Gespräche führt. Ideal, um Selbstbewusstsein beim Sprechen zu gewinnen und neue Freunde zu finden! 🤗',
        category: CourseCategory.language,
        subject: CourseSubject.Deutsch_als_Zweitsprache,
        tag: a2,
        state: CourseState.allowed,
        maxParticipants: 4,
        instructors: [leon, melanie],
        participants: [tom, sofia, diego, mateo],
        waitingList: [aisha],
        schedule: { weekdays: [3], time: '18:30', firstWeek: -2, weeks: 8 },
    });

    // Submitted and waiting for the review of a course screener
    await createCourse({
        name: '🇩🇪 Deutsch Basics: Die ersten Schritte 🏃‍➡️',
        outline: 'Grammatikgrundlagen, einfache Satzstrukturen, erste Texte.',
        description:
            'Wir machen gemeinsam die ersten Schritte in der deutschen Sprache! 📖 Von den wichtigsten Grammatikregeln bis hin zu ersten kurzen Texten lernst du hier alles, was du für den Anfang brauchst. Mit vielen praktischen Übungen wirst du schnell Fortschritte machen und deine ersten Sätze stolz vortragen können! 💪',
        category: CourseCategory.language,
        subject: 'Deutsch_als_Zweitsprache',
        tag: a1,
        state: CourseState.submitted,
        allowContact: false,
        instructors: [melanie],
        participants: [],
        schedule: { weekdays: [2, 4], time: '18:30', firstWeek: 2, weeks: 4 },
    });

    // Approved and published, starts next week
    await createCourse({
        name: 'Englisch für Anfänger 🇬🇧',
        outline: 'Wortschatz, einfache Sätze, und grundlegende Grammatik.',
        description:
            "Let's speak English! 🗣️ In diesem Kurs lernst du die ersten Wörter und Sätze auf Englisch. Wir üben zusammen, sodass du bald erste Gespräche führen kannst. Mit Spielen und Liedern macht Englisch lernen besonders viel Spaß!",
        category: CourseCategory.revision,
        state: CourseState.allowed,
        subject: CourseSubject.Englisch,
        instructors: [jon],
        participants: [max, emilia],
        schedule: { weekdays: [1], time: '15:30', firstWeek: 1, weeks: 6 },
    });

    await createCourse({
        name: 'Französisch für kleine Entdecker 🇫🇷',
        outline: 'Grundlagen der französischen Sprache, einfache Vokabeln, Sätze und Dialoge.',
        description:
            'Bienvenue! 🎨 Entdecke die Sprache der Croissants und Eiffeltürme! 🥐 In diesem Kurs lernst du die ersten Wörter und Sätze auf Französisch. Wir üben zusammen einfache Dialoge und lernen, wie man sich vorstellt oder sein Lieblingsessen beschreibt. Mit Liedern, Spielen und spannenden Geschichten wird das Französischlernen kinderleicht! 🌟 Bientôt, tu parleras français comme un pro! 😊',
        category: CourseCategory.revision,
        state: CourseState.allowed,
        subject: CourseSubject.Franz_sisch,
        instructors: [jon],
        participants: [diego, emilia],
        schedule: { weekdays: [5], time: '15:00', firstWeek: -4, weeks: 8, skipWeeks: [-2] },
    });

    await createCourse({
        name: 'Mathematik: Grundlagen und Vertiefung 🔍',
        outline: 'Rechnen, Algebra, Geometrie und Problemlösungstechniken.',
        description:
            'In diesem Kurs lernst du die wichtigsten mathematischen Grundlagen und vertiefst dein Wissen in Bereichen wie Algebra, Geometrie und der Problemlösung. Mit gezielten Übungen und klaren Erklärungen bereiten wir dich optimal auf Prüfungen und den Schulalltag vor. Mathe verstehen und anwenden – für eine starke Basis! 📐',
        category: CourseCategory.revision,
        state: CourseState.allowed,
        subject: CourseSubject.Mathematik,
        instructors: [melanie],
        participants: [max, emilia, aisha],
        schedule: { weekdays: [1], time: '18:00', firstWeek: -3, weeks: 8 },
    });

    // Finished: ended a month ago
    await createCourse({
        name: 'Mathe-Abenteuer für die Mittelstufe',
        outline: 'Prozentrechnen, Geometrie, Algebra und Textaufgaben.',
        description:
            'Bist du bereit für ein Mathe-Abenteuer? 🏰 In diesem Kurs entdecken wir gemeinsam die Geheimnisse der Prozentrechnung, Geometrie und Algebra. Mit spannenden Aufgaben und kniffligen Rätseln wirst du Mathe bald mit ganz neuen Augen sehen! 🚀 Wer weiß, vielleicht wirst du zum Mathe-Meister? 👑',
        category: CourseCategory.revision,
        state: CourseState.allowed,
        subject: CourseSubject.Mathematik,
        instructors: [jack],
        participants: [aisha, mateo],
        schedule: { weekdays: [2, 4], time: '16:00', firstWeek: -7, weeks: 4 },
    });

    await createCourse({
        name: 'Digitale Welt: Verstehen und Mitgestalten 🌐',
        outline: 'Internet, soziale Medien, digitale Sicherheit, und kreatives Arbeiten online.',
        description:
            'In der digitalen Welt gibt es viel zu entdecken! 🖥️ In diesem Kurs lernst du, wie das Internet funktioniert, wie du soziale Medien sicher nutzt und wie du eigene digitale Projekte umsetzen kannst. Wir sprechen über wichtige Themen wie Datenschutz, Fake News und digitale Kreativität. So wirst du fit für den sicheren Umgang mit der Online-Welt und kannst sie selbst mitgestalten! 🚀',
        category: CourseCategory.focus,
        state: CourseState.allowed,
        tag: digitalWorld,
        instructors: [leon],
        participants: [max, tom, mateo],
        schedule: { weekdays: [3], time: '15:00', firstWeek: -1, weeks: 6 },
    });

    // Full, with someone on the waiting list
    await createCourse({
        name: 'Entscheidungen treffen: Wege zum Ziel 🎯',
        outline: 'Entscheidungsfindung, Problemlösung, Pro und Kontra abwägen.',
        description:
            'Wie treffe ich die richtige Entscheidung? 🤔 In diesem Kurs lernst du, wie man zwischen verschiedenen Möglichkeiten abwägt, Probleme strukturiert angeht und die besten Lösungen findet. Mit spannenden Übungen und Beispielen aus dem Alltag üben wir gemeinsam, Entscheidungen selbstbewusst zu treffen. So lernst du, deine Ziele zu erreichen und dich auch in schwierigen Situationen zurechtzufinden! 💡',
        category: CourseCategory.focus,
        state: CourseState.allowed,
        tag: yourFuture,
        maxParticipants: 5,
        instructors: [paula],
        participants: [tom, aisha, mateo, emilia, diego],
        waitingList: [max],
        schedule: { weekdays: [5], time: '17:00', firstWeek: -2, weeks: 6 },
    });

    // Hausaufgabenhilfe: Monday to Thursday, with mentors
    await createCourse({
        name: 'Hausaufgabenhilfe',
        outline: 'Hausaufgabenhilfe',
        description:
            'Wenn du Hilfe bei deinen Schulaufgaben brauchst und dir Zuhause niemand helfen kann, dann helfen wir dir. Montag bis Donnerstag von 17-18 Uhr sind wir auf Zoom. \n\nBitte bringe deine Aufgaben mit, die du am Bildschirm zeigen kannst. \nZum Beispiel: \n- Deine Hausaufgaben \n- Übungsaufgaben für eine Klassenarbeit \n- Aufgaben, die du im Unterricht nicht verstanden hast',
        category: CourseCategory.homework_help,
        state: CourseState.allowed,
        maxParticipants: 1000,
        instructors: [leon, melanie, jon],
        mentors: [nina, omar],
        participants: [max, tom, aisha, lena, emilia, mateo],
        schedule: { weekdays: [1, 2, 3, 4], time: '17:00', firstWeek: -8, weeks: 14, skipWeeks: [-4] },
        allowContact: false,
        joinAfterStart: true,
        allowMentoring: true,
    });

    // Cancelled while it was running
    await createCourse({
        name: 'Programmieren mit Scratch 🐱',
        outline: 'Erste eigene Spiele und Animationen programmieren.',
        description:
            'Du wolltest schon immer mal dein eigenes Spiel programmieren? 🎮 Mit Scratch lernst du spielerisch, wie Programmieren funktioniert. Ganz ohne Vorkenntnisse bauen wir gemeinsam kleine Spiele und Animationen!',
        category: CourseCategory.focus,
        state: CourseState.allowed,
        subject: CourseSubject.Informatik,
        tag: keepAtIt,
        cancelled: true,
        instructors: [quentin],
        participants: [max, aisha],
        schedule: { weekdays: [6], time: '11:00', firstWeek: -1, weeks: 5 },
    });

    // Draft: the instructor has not submitted it yet and did not plan any appointments
    await createCourse({
        name: 'Lerntechniken: So lernst du richtig 🧠',
        outline: 'Lernpläne, Konzentration und Prüfungsvorbereitung.',
        description:
            'Wie lerne ich eigentlich richtig? 🤔 In diesem Kurs probieren wir verschiedene Lerntechniken aus, erstellen gemeinsam Lernpläne und üben, uns besser zu konzentrieren.',
        category: CourseCategory.coaching,
        state: CourseState.created,
        instructors: [quentin],
        participants: [],
    });

    // Denied by a course screener
    await createCourse({
        name: 'Gaming & Teamwork 🎮',
        outline: 'Spielen.',
        description: 'Wir spielen zusammen.',
        category: CourseCategory.club,
        state: CourseState.denied,
        screeningComment: 'Das Kursthema ist uns leider zu unspezifisch. Bitte überarbeite Beschreibung und Lernziele und reiche den Kurs erneut ein.',
        instructors: [paula],
        participants: [],
        schedule: { weekdays: [2], time: '18:00', firstWeek: 3, weeks: 4 },
    });

    await createInternshipCertificateFixture(studentScreener);

    await importAchievements();

    if (!process.env.SKIP_NOTIFICATION_IMPORT) {
        await importNotificationsFromProd();
        await importMessagesTranslationsFromProd();
    }

    _setSilenceNotificationSystem(false);
    await scheduleCoCReminders(walter);

    logger.info(`Successfully seeded the DB`);
})();

function sha512(input: string): string {
    const hash = createHash('sha512');
    return hash.update(input).digest('hex');
}

const PROD_URL = 'https://api.lern-fair.de/apollo';

async function importNotificationsFromProd() {
    const existingNotifications = await getNotifications();
    if (existingNotifications.size) {
        throw new Error(`Cannot import from Prod as notifications exist`);
    }

    const prodNotifications = await (
        await fetch(PROD_URL, {
            body: JSON.stringify({
                query: `
                query {
                    notifications {
                        id
                        mailjetTemplateId
                        description
                        active
                        recipient
                        onActions
                        cancelledOnAction
                        type
                        delay
                        interval
                        sender
                        hookID
                        sample_context
                    }
                }`,
                variables: {},
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

    await importNotifications(prodNotifications.data.notifications, false, true);
    logger.info(`Imported notifications from productive landscape`, prodNotifications.data.notifications);
}

async function importMessagesTranslationsFromProd() {
    const prodMessageTranslations = await (
        await fetch(PROD_URL, {
            body: JSON.stringify({
                query: `
                    query {
                        notifications {
                            messageTranslations {
                                template
                                id
                                notificationId
                                navigateTo
                            }
                        }
                    }
                `,
                variables: {},
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

    const messageTranslations = prodMessageTranslations.data.notifications.reduce((acc: any[], cur: any) => [...acc, ...cur.messageTranslations], []);

    await importMessageTranslations(messageTranslations);
}
