import {
    ACTUAL_DURATION_INTRODUCTION_DATE,
    CertificateAppointment,
    countsForCertificate,
    getAppointmentDuration,
    getBonusDuration,
    getInstantCertificateStats,
    getTotalAppointmentsDuration,
    JOINED_BY_INTRODUCTION_DATE,
    roundSupportDuration,
} from './duration';

const STUDENT = 'student/1';
const PUPIL = 'pupil/1';
const OTHER_PUPIL = 'pupil/2';

// joinedBy was not tracked yet
const BEFORE_JOINED_BY = new Date('2025-01-10T15:00:00Z');
// joinedBy is tracked, but lectures are still credited with their planned duration
const BEFORE_ACTUAL_DURATION = new Date('2026-05-01T15:00:00Z');
// match lectures are credited with their actual duration
const AFTER_ACTUAL_DURATION = new Date('2026-10-15T15:00:00Z');

const BOTH_JOINED = [STUDENT, PUPIL];

function matchLecture(overrides: Partial<CertificateAppointment> = {}): CertificateAppointment {
    return { appointmentType: 'match', start: AFTER_ACTUAL_DURATION, duration: 60, actualDuration: 55, joinedBy: BOTH_JOINED, ...overrides };
}

function courseLecture(overrides: Partial<CertificateAppointment> = {}): CertificateAppointment {
    return { appointmentType: 'group', start: AFTER_ACTUAL_DURATION, duration: 90, joinedBy: BOTH_JOINED, ...overrides };
}

const times = (count: number, lecture: CertificateAppointment) => Array.from({ length: count }, () => ({ ...lecture }));

describe('roundSupportDuration', () => {
    it.each([
        [1, 15],
        [10, 15],
        [11, 30],
        [25, 30],
        [26, 45],
        [40, 45],
        [45, 60],
        [55, 60],
        [56, 75],
        [60, 75],
    ])('credits %i minutes as %i minutes', (actual, expected) => {
        expect(roundSupportDuration(actual)).toEqual(expected);
    });
});

describe('getAppointmentDuration', () => {
    it('credits match lectures with the rounded actual duration', () => {
        expect(getAppointmentDuration(matchLecture({ duration: 60, actualDuration: 38 }))).toEqual(45);
    });

    it('can credit more than the planned duration if the meeting ran longer', () => {
        expect(getAppointmentDuration(matchLecture({ duration: 60, actualDuration: 80 }))).toEqual(90);
    });

    it('credits nothing for match lectures without an actual duration', () => {
        expect(getAppointmentDuration(matchLecture({ actualDuration: undefined }))).toEqual(0);
        expect(getAppointmentDuration(matchLecture({ actualDuration: null }))).toEqual(0);
        expect(getAppointmentDuration(matchLecture({ actualDuration: 0 }))).toEqual(0);
    });

    it('uses the actual duration starting exactly at the introduction date', () => {
        expect(getAppointmentDuration(matchLecture({ start: ACTUAL_DURATION_INTRODUCTION_DATE, duration: 60, actualDuration: 20 }))).toEqual(30);
    });

    it('credits match lectures before the introduction of the actual duration with the planned duration', () => {
        const justBefore = new Date(ACTUAL_DURATION_INTRODUCTION_DATE.getTime() - 1);
        expect(getAppointmentDuration(matchLecture({ start: justBefore, duration: 60, actualDuration: 20 }))).toEqual(60);
        expect(getAppointmentDuration(matchLecture({ start: BEFORE_JOINED_BY, duration: 45, actualDuration: undefined }))).toEqual(45);
    });

    it('always credits course lectures with the planned duration', () => {
        expect(getAppointmentDuration(courseLecture({ duration: 90, actualDuration: 20 }))).toEqual(90);
        expect(getAppointmentDuration(courseLecture({ start: BEFORE_ACTUAL_DURATION, duration: 90 }))).toEqual(90);
    });

    it('credits nothing if the planned duration is missing', () => {
        expect(getAppointmentDuration(courseLecture({ duration: undefined }))).toEqual(0);
        expect(getAppointmentDuration(courseLecture({ duration: null }))).toEqual(0);
    });
});

describe('countsForCertificate', () => {
    it('counts lectures before joinedBy was tracked, no matter who joined', () => {
        expect(countsForCertificate(matchLecture({ start: BEFORE_JOINED_BY, joinedBy: [] }), STUDENT)).toBe(true);
        expect(countsForCertificate(matchLecture({ start: BEFORE_JOINED_BY, joinedBy: [PUPIL] }), STUDENT)).toBe(true);
    });

    it('counts lectures that the student and someone else joined', () => {
        expect(countsForCertificate(matchLecture({ joinedBy: [STUDENT, PUPIL] }), STUDENT)).toBe(true);
        expect(countsForCertificate(courseLecture({ joinedBy: [PUPIL, OTHER_PUPIL, STUDENT] }), STUDENT)).toBe(true);
    });

    it('does not count lectures where the student was alone', () => {
        expect(countsForCertificate(matchLecture({ joinedBy: [STUDENT] }), STUDENT)).toBe(false);
    });

    it('does not count lectures the student did not join', () => {
        expect(countsForCertificate(courseLecture({ joinedBy: [PUPIL, OTHER_PUPIL] }), STUDENT)).toBe(false);
        expect(countsForCertificate(matchLecture({ joinedBy: [] }), STUDENT)).toBe(false);
    });

    it('requires joining starting exactly at the introduction date', () => {
        expect(countsForCertificate(matchLecture({ start: JOINED_BY_INTRODUCTION_DATE, joinedBy: [] }), STUDENT)).toBe(false);
        expect(countsForCertificate(matchLecture({ start: new Date(JOINED_BY_INTRODUCTION_DATE.getTime() - 1), joinedBy: [] }), STUDENT)).toBe(true);
    });
});

describe('getBonusDuration', () => {
    it.each([
        [0, 0],
        [5, 0],
        [6, 60],
        [11, 60],
        [12, 120],
        [20, 180],
    ])('gives for %i match lectures a bonus of %i minutes', (count, expected) => {
        expect(getBonusDuration(times(count, matchLecture()), STUDENT)).toEqual(expected);
    });

    it('ignores course lectures', () => {
        expect(getBonusDuration(times(6, courseLecture()), STUDENT)).toEqual(0);
        expect(getBonusDuration([...times(5, matchLecture()), courseLecture()], STUDENT)).toEqual(0);
    });

    it('ignores lectures before the introduction of the actual duration', () => {
        expect(getBonusDuration(times(6, matchLecture({ start: BEFORE_ACTUAL_DURATION })), STUDENT)).toEqual(0);
        expect(getBonusDuration(times(6, matchLecture({ start: BEFORE_JOINED_BY })), STUDENT)).toEqual(0);
        expect(getBonusDuration([...times(5, matchLecture()), matchLecture({ start: BEFORE_ACTUAL_DURATION })], STUDENT)).toEqual(0);
    });

    it('ignores lectures that did not take place', () => {
        expect(getBonusDuration([...times(5, matchLecture()), matchLecture({ joinedBy: [STUDENT] })], STUDENT)).toEqual(0);
        expect(getBonusDuration([...times(5, matchLecture()), matchLecture({ joinedBy: [PUPIL, OTHER_PUPIL] })], STUDENT)).toEqual(0);
    });

    it('counts lectures without an actual duration', () => {
        expect(getBonusDuration(times(6, matchLecture({ actualDuration: undefined })), STUDENT)).toEqual(60);
    });
});

describe('getTotalAppointmentsDuration', () => {
    it('is zero without lectures', () => {
        expect(getTotalAppointmentsDuration([], STUDENT)).toEqual(0);
    });

    it('sums up match and course lectures across all periods', () => {
        const lectures = [
            matchLecture({ start: BEFORE_JOINED_BY, duration: 60, joinedBy: [] }), // 60, planned
            matchLecture({ start: BEFORE_ACTUAL_DURATION, duration: 45, actualDuration: 10 }), // 45, planned
            matchLecture({ duration: 60, actualDuration: 38 }), // 45, rounded actual
            courseLecture({ start: BEFORE_ACTUAL_DURATION, duration: 90 }), // 90
            courseLecture({ duration: 120 }), // 120
        ];
        expect(getTotalAppointmentsDuration(lectures, STUDENT)).toEqual(60 + 45 + 45 + 90 + 120);
    });

    it('skips lectures that did not take place', () => {
        const lectures = [
            matchLecture({ actualDuration: 55 }), // 60
            matchLecture({ joinedBy: [STUDENT] }),
            matchLecture({ start: BEFORE_ACTUAL_DURATION, joinedBy: [] }),
            courseLecture({ joinedBy: [PUPIL, OTHER_PUPIL] }),
        ];
        expect(getTotalAppointmentsDuration(lectures, STUDENT)).toEqual(60);
    });

    it('adds the bonus on top', () => {
        // 6 * 60 minutes + 60 minutes bonus
        expect(getTotalAppointmentsDuration(times(6, matchLecture({ actualDuration: 55 })), STUDENT)).toEqual(420);
    });

    it('does not let course lectures contribute to the bonus', () => {
        const lectures = [...times(5, matchLecture({ actualDuration: 55 })), ...times(3, courseLecture({ duration: 90 }))];
        expect(getTotalAppointmentsDuration(lectures, STUDENT)).toEqual(5 * 60 + 3 * 90);
    });
});

describe('getInstantCertificateStats', () => {
    it('returns zeros for a student without lectures', () => {
        expect(getInstantCertificateStats({ matchAppointments: [], courseAppointments: [], appointmentsForDuration: [] }, STUDENT)).toEqual({
            matchAppointmentsCount: 0,
            totalMatchAppointmentsDuration: 0,
            courseAppointmentsCount: 0,
            totalCourseAppointmentDuration: 0,
            totalAppointmentsDuration: 0,
        });
    });

    it('computes counts and durations for match and course lectures', () => {
        const matchAppointments = [
            matchLecture({ start: BEFORE_JOINED_BY, duration: 60, joinedBy: [] }), // 60
            matchLecture({ start: BEFORE_ACTUAL_DURATION, duration: 45, actualDuration: 10 }), // 45
            matchLecture({ start: BEFORE_ACTUAL_DURATION, duration: 45, joinedBy: [STUDENT] }), // pupil did not show up
            ...times(6, matchLecture({ duration: 60, actualDuration: 38 })), // 6 * 45 + 60 bonus
            matchLecture({ joinedBy: [PUPIL] }), // student did not show up
        ];
        // The course lectures are queried without their appointment type
        const courseAppointments = [
            courseLecture({ appointmentType: undefined, start: BEFORE_JOINED_BY, duration: 60, joinedBy: [] }), // 60
            courseLecture({ appointmentType: undefined, duration: 90, joinedBy: [STUDENT, PUPIL, OTHER_PUPIL] }), // 90
            courseLecture({ appointmentType: undefined, duration: 90, joinedBy: [STUDENT] }), // nobody showed up
        ];
        const appointmentsForDuration = [...matchAppointments, ...courseAppointments.map((it) => ({ ...it, appointmentType: 'group' as const }))];

        const stats = getInstantCertificateStats({ matchAppointments, courseAppointments, appointmentsForDuration }, STUDENT);

        expect(stats).toEqual({
            matchAppointmentsCount: 8,
            totalMatchAppointmentsDuration: 60 + 45 + 6 * 45 + 60,
            courseAppointmentsCount: 2,
            totalCourseAppointmentDuration: 60 + 90,
            totalAppointmentsDuration: 60 + 45 + 6 * 45 + 60 + 60 + 90,
        });
        expect(stats.totalAppointmentsDuration).toEqual(stats.totalMatchAppointmentsDuration + stats.totalCourseAppointmentDuration);
    });

    it('counts a match lecture without an actual duration as an appointment, but credits no time for it', () => {
        const matchAppointments = [matchLecture({ actualDuration: undefined })];

        expect(getInstantCertificateStats({ matchAppointments, courseAppointments: [], appointmentsForDuration: matchAppointments }, STUDENT)).toMatchObject({
            matchAppointmentsCount: 1,
            totalMatchAppointmentsDuration: 0,
            totalAppointmentsDuration: 0,
        });
    });

    it('only considers the lectures of the given user', () => {
        const matchAppointments = times(6, matchLecture({ joinedBy: ['student/2', PUPIL] }));

        expect(getInstantCertificateStats({ matchAppointments, courseAppointments: [], appointmentsForDuration: matchAppointments }, STUDENT)).toMatchObject({
            matchAppointmentsCount: 0,
            totalMatchAppointmentsDuration: 0,
            totalAppointmentsDuration: 0,
        });
    });
});
