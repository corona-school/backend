import { lecture_appointmenttype_enum } from '@prisma/client';

// Before this date joinedBy was not tracked, so older lectures count regardless of who joined
export const JOINED_BY_INTRODUCTION_DATE = new Date('2025-03-25');
// From this date on, match lectures are credited with the time that was actually spent in the meeting
export const ACTUAL_DURATION_INTRODUCTION_DATE = new Date('2026-10-01');

export interface CertificateAppointment {
    // Not selected for course lectures, they are always credited with their planned duration
    appointmentType?: lecture_appointmenttype_enum;
    start: Date;
    duration?: number;
    actualDuration?: number;
    joinedBy: string[];
}

export interface InstantCertificateStats {
    matchAppointmentsCount: number;
    totalMatchAppointmentsDuration: number; // in minutes
    courseAppointmentsCount: number;
    totalCourseAppointmentDuration: number; // in minutes
    totalAppointmentsDuration: number; // in minutes
}

// We add 5 minutes to the duration and then round it up to the nearest 15 minutes
export const roundSupportDuration = (duration: number) => {
    return Math.ceil((duration + 5) / 15) * 15;
};

// A lecture only took place if the student and at least one other person joined
const hasTakenPlace = (lecture: CertificateAppointment, userID: string) => lecture.joinedBy.length >= 2 && lecture.joinedBy.includes(userID);

// Lectures from before joinedBy was tracked always count, afterwards only the ones that took place
export const countsForCertificate = (lecture: CertificateAppointment, userID: string) => {
    if (lecture.start < JOINED_BY_INTRODUCTION_DATE) {
        return true;
    }
    return hasTakenPlace(lecture, userID);
};

// We give extra time of 60 mins for every 6 lectures that actually happened (both HuH and SuS present)
// This only applies to lectures after the introduction of actual duration
export const getBonusDuration = (appointments: CertificateAppointment[], userID: string) => {
    const validAppointments = appointments.filter((l) => {
        const isAfterActualDurationIntroduction = l.start >= ACTUAL_DURATION_INTRODUCTION_DATE;
        const isMatchAppointment = l.appointmentType === 'match';
        return isAfterActualDurationIntroduction && hasTakenPlace(l, userID) && isMatchAppointment;
    });

    const bonusDuration = Math.floor(validAppointments.length / 6) * 60; // 60 minutes for every 6 valid match appointments
    return bonusDuration;
};

// Returns the duration of a single appointment, taking into account actual duration for match appointments after the introduction date
export const getAppointmentDuration = (lecture: CertificateAppointment) => {
    if (lecture.appointmentType === 'match' && lecture.start >= ACTUAL_DURATION_INTRODUCTION_DATE) {
        return lecture.actualDuration ? roundSupportDuration(lecture.actualDuration) : 0;
    }
    return lecture.duration ?? 0;
};

export const getTotalAppointmentsDuration = (appointments: CertificateAppointment[], userID: string) => {
    const appointmentsDuration = appointments.filter((l) => countsForCertificate(l, userID)).reduce((sum, l) => sum + getAppointmentDuration(l), 0);
    return appointmentsDuration + getBonusDuration(appointments, userID);
};

/* Computes the appointment counts and durations shown on the instant certificate.
   All lectures passed in are expected to be past, not cancelled lectures of the student with the given userID */
export function getInstantCertificateStats(
    lectures: { matchAppointments: CertificateAppointment[]; courseAppointments: CertificateAppointment[]; appointmentsForDuration: CertificateAppointment[] },
    userID: string
): InstantCertificateStats {
    const validMatchAppointments = lectures.matchAppointments.filter((l) => countsForCertificate(l, userID));
    const validCourseAppointments = lectures.courseAppointments.filter((l) => countsForCertificate(l, userID));

    return {
        matchAppointmentsCount: validMatchAppointments.length,
        totalMatchAppointmentsDuration:
            validMatchAppointments.reduce((sum, l) => sum + getAppointmentDuration(l), 0) + getBonusDuration(validMatchAppointments, userID),
        courseAppointmentsCount: validCourseAppointments.length,
        totalCourseAppointmentDuration: validCourseAppointments.reduce((sum, l) => sum + (l.duration ?? 0), 0),
        totalAppointmentsDuration: getTotalAppointmentsDuration(lectures.appointmentsForDuration, userID),
    };
}
