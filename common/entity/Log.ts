import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum LogType {
    MISC = 'misc',
    VERIFICATION_REQUEST = 'verificationRequets',
    VERIFIED = 'verified',
    MATCH_DISSOLVE = 'matchDissolve',
    PROJECT_MATCH_DISSOLVE = 'projectMatchDissolve',
    FETCHED_FROM_WIX = 'fetchedFromWix',
    DEACTIVATE = 'deActivate',
    UPDATE_PERSONAL = 'updatePersonal',
    UPDATE_SUBJECTS = 'updateSubjects',
    UPDATE_PROJECTFIELDS = 'updateProjectFields',
    ACCESSED_BY_SCREENER = 'accessedByScreener',
    UPDATED_BY_SCREENER = 'updatedByScreener',
    UPDATE_STUDENT_DESCRIPTION = 'updateStudentDescription',
    CREATED_COURSE = 'createdCourse',
    CERTIFICATE_REQUEST = 'certificateRequest',
    COC_CANCEL = 'cocCancel',
    CANCELLED_COURSE = 'cancelledCourse',
    CANCELLED_SUBCOURSE = 'cancelledSubcourse',
    CREATED_COURSE_ATTENDANCE_LOG = 'createdCourseAttendanceLog',
    CONTACT_MENTOR = 'contactMentor',
    CREATED_BBB_MEETING = 'bbbMeeting',
    CONTACT_EXPERT = 'contactExpert',
    PARTICIPANT_JOINED_COURSE = 'participantJoinedCourse',
    PARTICIPANT_LEFT_COURSE = 'participantLeftCourse',
    PARTICIPANT_JOINED_WAITING_LIST = 'participantJoinedWaitingList',
    PARTICIPANT_LEFT_WAITING_LIST = 'participantLeftWaitingList',
    ACCESSED_COURSED = 'userAccessedCourseWhileAuthenticated',
    INSTRUCTOR_ISSUED_CERTIFICATE = 'instructorIssuedCertificate',
    PUPIL_INTEREST_CONFIRMATION_REQUEST_SENT = 'pupilInterestConfirmationRequestSent',
    PUPIL_INTEREST_CONFIRMATION_REQUEST_REMINDER_SENT = 'pupilInterestConfirmationRequestReminderSent',
    PUPIL_INTEREST_CONFIRMATION_REQUEST_STATUS_CHANGE = 'pupilInterestConfirmationRequestStatusChange',
}

@Entity()
export default class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: LogType,
        default: LogType.MISC,
    })
    logtype: LogType;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column()
    user: string; // User identifier. For students and pupils the wix_id is used

    @Column()
    data: string;
}
