import {
    log as Log,
    log_logtype_enum as LogType,
    pupil as Pupil,
    student as Student,
    course_attendance_log as CourseAttendanceLog,
    bbb_meeting as BBBMeeting,
} from '@prisma/client';
import { InterestConfirmationStatus } from '../../common/entity/PupilTutoringInterestConfirmationRequest';
import { getLogger } from 'log4js';
import { MentoringCategory } from '../mentoring/categories';
import { prisma } from '../prisma';

/* To ensure consistency with existing logs,
  the JSON data in the log is validated against this schema */
type LogData<Type extends LogType> = {
    misc: never;
    verificationRequets: {};
    verified: {};
    matchDissolve: { matchId: number };
    projectMatchDissolve: { projectMatchId: number };
    fetchedFromWix: never;
    deActivate: { newStatus: boolean; deactivationReason?: string; deactivationFeedback?: string };
    updatePersonal: any;
    updateSubjects: { oldSubjects: string[] };
    updateProjectFields: { oldProjectFields: string[] };
    accessedByScreener: { screener: string };
    updatedByScreener: { screener: string; changes?: { prev: any; new: any } };
    updateStudentDescription: never;
    createdCourse: { id: number };
    certificateRequest: { uuid: string };
    cancelledCourse: { id: number };
    cancelledSubcourse: { id: number };
    createdCourseAttendanceLog: { courseAttendanceLog: CourseAttendanceLog };
    contactMentor: { category: MentoringCategory; text: string; subject?: string };
    bbbMeeting: { bbbMeeting: BBBMeeting };
    contactExpert: { emailText: string; subject?: string };
    participantJoinedCourse: { subcourseID: number };
    participantLeftCourse: { subcourseID: number };
    participantJoinedWaitingList: { courseID: number };
    participantLeftWaitingList: { courseID: number };
    userAccessedCourseWhileAuthenticated: { course: number };
    instructorIssuedCertificate: { subcourseID: number; pupilID: number };
    pupilInterestConfirmationRequestSent: never;
    pupilInterestConfirmationRequestReminderSent: never;
    pupilInterestConfirmationRequestStatusChange: { changeDate: number; newStatus: InterestConfirmationStatus; previousStatus: InterestConfirmationStatus };
}[Type];

const logger = getLogger();

export async function logTransaction<Type extends LogType>(logtype: Type, user: Pupil | Student | null, data: LogData<Type>) {
    try {
        await prisma.log.create({
            data: {
                logtype,
                createdAt: new Date(),
                user: user?.wix_id ?? 'unknown',
                data: JSON.stringify(data),
            },
        });
    } catch (error) {
        logger.warn(`Failed to write to transaction log`, error);
    }
}
