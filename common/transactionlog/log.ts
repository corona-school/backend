import {
    log_logtype_enum as LogType,
    pupil as Pupil,
    student as Student,
    course_attendance_log as CourseAttendanceLog,
    bbb_meeting as BBBMeeting,
} from '@prisma/client';
import { getLogger } from '../../common/logger/logger';
import { InterestConfirmationStatus } from '../match/interest';
import { prisma } from '../prisma';
import { User } from '../user';

/* To ensure consistency with existing logs,
  the JSON data in the log is validated against this schema */
type LogData<Type extends LogType> = {
    misc: never;
    verificationRequets: object;
    verified: object;
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
    cocCancel: { studentId: number };
    cancelledCourse: { id: number };
    cancelledSubcourse: { id: number };
    createdCourseAttendanceLog: { courseAttendanceLog: CourseAttendanceLog };
    contactMentor: { category: any; text: string; subject?: string };
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
    skippedCoC: { screenerId: number };
}[Type];

const logger = getLogger();

export async function logTransaction<Type extends LogType>(logtype: Type, user: User | null, data: LogData<Type>) {
    try {
        await prisma.log.create({
            data: {
                logtype,
                createdAt: new Date(),
                user: user?.userID ?? 'unknown',
                data: JSON.stringify(data),
            },
        });
    } catch (error) {
        logger.warn(`Failed to write to transaction log`, error);
    }
}
