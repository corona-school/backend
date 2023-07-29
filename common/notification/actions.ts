// Actions mark a certain event that a user triggered and which sends out notifications, schedules or cancels reminders
// In the backend actions are only their 'id' which is stored in the Notification entity,
//  however a few other attributes of the action are maintained here to provide admin users with better tooling
//  for creating notifications for these actions. The ones documented here are incomplete

import { NotificationContextExtensions } from './types';

type NestedStringObject = { [key: string]: string | boolean | NestedStringObject };

export interface NotificationAction {
    readonly id: string;
    readonly description: string;
    readonly sampleContext?: NestedStringObject;
    readonly recommendedCancelations?: readonly string[];
}

const sampleUser = { firstname: 'Max', fullName: 'Max Mustermann' };
const sampleCourse = {
    course: {
        name: 'Apollo',
        description: "That's one small step for a man, one giant leap for mankind.",
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg',
    },
    subcourse: {
        url: `https://app.lern-fair.de/single-course/1`,
    },
    firstLecture: {
        date: '20. Juli 1969',
        time: '19:17',
        day: 'Sonntag',
    },
};

const sampleAppointment = {
    start_day: 'Sonntag',
    start_date: '20. Juli 1969',
    start_time: '19:17',
    end_time: '20:17',
    title: 'Chapter 1',
    original: {
        day: 'Montag',
        start_date: '21. Juli 1969',
        start_time: '19:17',
        end_time: '20:17',
    },
};

const sampleMissedCourseMessage = {
    sender: { firstname: 'Leon' },
    conversationId: '1',
    message: 'Hey',
    totalUnread: '1',
    courseId: '1',
    courseName: 'Gen Z',
};

const sampleMissedOneOnOneMessage = {
    sender: { firstname: 'Max' },
    conversationId: '2',
    message: 'Hey!',
    totalUnread: '1',
    matchId: '1',
};

const DEPRECATED = {
    description: 'DEPRECATED - DO NOT USE',
    sampleContext: {},
};

// The following is not typed to be able to extract the string literal types via 'as const', types are checked below
const _notificationActions = {
    student_registration_started: {
        description: 'Student / Registered',
        sampleContext: {
            redirectTo: 'https://app.lern-fair.de',
        },
    },
    pupil_registration_started: {
        description: 'Pupil / Registered',
        sampleContext: {
            redirectTo: 'https://app.lern-fair.de',
        },
    },
    user_registration_verified_email: {
        description: 'User / E-Mail verified',
        sampleContext: {},
    },
    pupil_screening_add: {
        description: 'Pupil / Screening was added',
        sampleContext: {},
    },
    pupil_screening_rejected: {
        description: 'Pupil / Screening was rejected',
        sampleContext: {},
    },
    pupil_screening_succeeded: {
        description: 'Pupil / Screening was successful',
        sampleContext: {},
    },
    pupil_registration_finished: {
        description: 'Pupil / Registration finished',
        sampleContext: {},
    },
    pupil_joined_plus: {
        description: 'Pupil / Joined Lern-Fair Plus',
        sampleContext: {},
    },
    tutor_screening_invitation: {
        description: 'Tutor / Was invited for screening',
        sampleContext: {},
    },
    tutor_screening_success: {
        description: 'Tutor / Screening was successful',
        sampleContext: {},
    },
    tutor_screening_rejection: {
        description: 'Tutor / Screening was rejected',
        sampleContext: {},
    },
    instructor_screening_invitation: {
        description: 'Instructor was invited for screening',
        sampleContext: {},
    },
    instructor_screening_success: {
        description: 'Instructor / Screening was successful',
        sampleContext: {},
    },
    instructor_screening_rejection: {
        description: 'Instructor / Screening was rejected',
        sampleContext: {},
    },
    participant_course_joined: {
        description: 'Participant / Joined Course',
        sampleContext: {
            course: {
                name: 'Hallo Welt',
                description: 'Ein Kurs',
            },
            firstLectureDate: '12.12.1984',
            firstLectureTime: '12:00',
        },
        recommendedCancelations: ['participant_course_leave', 'participant_course_cancelled'],
    },
    participant_course_cancelled: {
        description: 'Participant / Course was cancelled',
        sampleContext: {
            ...sampleCourse,
        },
    },
    participant_course_waiting_list_join: {
        description: 'Participant / Joined Waitinglist of Course',
        sampleContext: {
            course: {
                name: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
        recommendedCancelations: ['participant_course_waiting_list_leave'],
    },
    participant_course_leave: {
        description: 'Participant / Joined Course',
        sampleContext: {
            course: {
                name: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    participant_course_waiting_list_leave: {
        description: 'Participant / Left Waitinglist of Course',
        sampleContext: {
            course: {
                name: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    participant_subcourse_reminder: {
        description: 'Participant / Course starts soon',
        sampleContext: {
            ...sampleCourse,
        },
    },
    instructor_course_created: {
        description: 'Instructor / Course created (not yet published)',
        sampleContext: {
            course: {
                name: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_course_cancelled: {
        description: 'Instructor / Course cancelled',
        sampleContext: {
            course: {
                name: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_course_published: {
        description: 'Instructor / Course published',
        sampleContext: {
            course: {
                name: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_course_reminder: {
        description: 'Instructor / Course starts soon',
        sampleContext: {
            course: {
                name: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_subcourse_published: {
        description: 'Pupil / New course was published',
        sampleContext: sampleCourse,
    },
    available_places_on_subcourse: {
        description: 'Pupil / Available places on subcourse',
        sampleContext: sampleCourse,
    },
    student_certificate_sign: {
        description: 'Student / Tutoring Certificate was signed',
        sampleContext: {
            pupil: sampleUser,
            certificateLink: 'https://...',
        },
    },
    pupil_certificate_approval: {
        description: 'Pupil / Tutoring Certificate needs approval',
        sampleContext: {
            student: sampleUser,
            certificateLink: 'https://...',
        },
    },
    tutee_match_dissolved_other: {
        description: 'Tutee / Match was dissolved by student',
        sampleContext: {
            student: sampleUser,
            matchHash: '...',
            matchDate: '...',
        },
    },
    tutee_match_dissolved: {
        description: 'Tutee / Match was dissolved',
        sampleContext: {
            student: sampleUser,
            matchHash: '...',
            matchDate: '...',
        },
    },
    tutor_match_dissolved_other: {
        description: 'Tutor / Match was dissolved by pupil',
        sampleContext: {
            pupil: sampleUser,
            matchHash: '...',
            matchDate: '...',
        },
    },
    tutor_match_dissolved: {
        description: 'Tutor / Match was dissolved',
        sampleContext: {
            pupil: sampleUser,
            matchHash: '...',
            matchDate: '...',
        },
    },
    tutee_matching_success: {
        description: 'Tutee / Match success',
        sampleContext: {
            student: sampleUser,
            matchSubjects: 'Deutsch, Englisch',
            matchHash: '...',
            matchDate: '...',
            firstMatch: true,
        },
    },
    'tutee_matching_lern-fair-now': {
        description: 'Tutee / Lern-Fair Now Match success',
        sampleContext: {
            student: sampleUser,
        },
    },
    'tutee_matching_lern-fair-plus': {
        description: 'Tutee / Lern-Fair Plus Match success',
        sampleContext: {
            student: sampleUser,
        },
    },
    'tutee_matching_TEST-DO-NOT-USE': DEPRECATED,

    tutor_matching_success: {
        description: 'Tutor / Match success',
        sampleContext: {
            pupil: sampleUser,
            pupilGrade: '3. Klasse',
            matchHash: '...',
            matchDate: '...',
            firstMatch: true,
        },
    },
    'tutor_matching_lern-fair-now': {
        description: 'Tutor / Lern-Fair Now Match success',
        sampleContext: {
            pupil: sampleUser,
        },
    },
    'tutor_matching_lern-fair-plus': {
        description: 'Tutor / Lern-Fair Plus Match success',
        sampleContext: {
            pupil: sampleUser,
        },
    },
    'tutor_matching_TEST-DO-NOT-USE': DEPRECATED,
    tutee_matching_confirm_interest: {
        description: 'Tutee / Confirm Interest',
        sampleContext: {
            confirmationURL: 'https://...',
            refusalURL: 'https://...',
        },
    },
    tutee_matching_confirm_interest_reminder: {
        description: 'Tutee / Confirm Interest Reminder',
        sampleContext: {
            confirmationURL: 'https://...',
            refusalURL: 'https://...',
        },
    },

    student_coc_updated: {
        description: 'Student / Certificate of Conduct handed in',
        sampleContext: {},
    },
    coc_reminder: {
        description: 'Student / Certificate of Conduct Request',
        sampleContext: {},
    },
    coc_cancelled: {
        description: 'Student / Certificate of Conduct Cancelled',
        sampleContext: {},
    },

    instructor_course_participant_message: {
        description: 'Instructor / Course Message from Participant',
        sampleContext: {
            instructorFirstName: 'Leon',
            participantFirstName: 'Max',
            courseName: 'Beispielkurs',
            messageTitle: 'Testtitel',
            messageBody: 'Testcontent',
            participantMail: 'max@example.com',
            replyToAddress: 'leon@example.com',
        },
    },
    participant_course_message: {
        description: 'Participant / Course Message from Instructor',
        sampleContext: {
            instructorFirstName: 'Leon',
            participantFirstName: 'Max',
            courseName: 'Beispielkurs',
            messageTitle: 'Testtitel',
            messageBody: 'Testcontent',
            instructorMail: 'max@example.com',
            replyToAddress: 'leon@example.com',
        },
    },

    pupil_account_deactivated: {
        description: 'Pupil / Account deactivated',
        sampleContext: {},
    },
    student_account_deactivated: {
        description: 'Student / Account deactivated',
        sampleContext: {},
    },

    'user-verify-email': {
        description: 'User / Verify E-Mail',
        sampleContext: {
            token: 'token',
            redirectTo: '/start',
        },
    },
    'user-authenticate': {
        description: 'User / Login',
        sampleContext: {
            token: 'token',
            redirectTo: '/start',
        },
    },
    'user-password-reset': {
        description: 'User / Reset Password',
        sampleContext: {
            token: 'token',
            redirectTo: '/start',
        },
    },
    'user-email-change': {
        description: 'User / Change Email',
        sampleContext: {
            token: 'token',
            redirectTo: '/start',
        },
    },
    student_add_appointment_group: {
        description: 'Student / Group Appointment Added',
        sampleContext: {
            student: sampleUser,
            ...sampleCourse,
        },
    },
    student_add_appointments_group: {
        description: 'Student / Group Appointments Added',
        sampleContext: {
            student: sampleUser,
            ...sampleCourse,
        },
    },
    student_add_appointment_match: {
        description: 'Student / Match Appointment Added',
        sampleContext: {
            student: sampleUser,
            matchId: '1',
        },
    },
    student_add_appointments_match: {
        description: 'Student / Match Appointments Added',
        sampleContext: {
            student: sampleUser,
            matchId: '1',
        },
    },
    pupil_decline_appointment_group: {
        description: 'Instructor / Group Appointment declined by Participant',
        sampleContext: {
            appointment: sampleAppointment,
            pupil: sampleUser,
            ...sampleCourse,
        },
    },
    pupil_decline_appointment_match: {
        description: 'Tutor / Match Appointment declined by Pupil',
        sampleContext: {
            appointment: sampleAppointment,
            pupil: sampleUser,
        },
    },
    student_cancel_appointment_group: {
        description: 'Student / Group Appointment Cancelled',
        sampleContext: {
            appointment: sampleAppointment,
            student: sampleUser,
            ...sampleCourse,
        },
    },
    student_cancel_appointment_match: {
        description: 'Tutee / Match Appointment cancelled by Student',
        sampleContext: {
            appointment: sampleAppointment,
            student: sampleUser,
        },
    },
    pupil_change_appointment_group: {
        description: 'Participant / Group Appointment updated by Student',
        sampleContext: {
            student: sampleUser,
            appointment: sampleAppointment,
            ...sampleCourse,
        },
    },
    pupil_change_appointment_match: {
        description: 'Tutee / Match Appointment updated by Student',
        sampleContext: {
            student: sampleUser,
            appointment: sampleAppointment,
        },
    },
    missed_one_on_one_chat_message: {
        description: 'Missed message in 1:1 chat',
        sampleContext: sampleMissedOneOnOneMessage,
    },
    missed_course_chat_message: {
        description: 'Missed message in group chat',
        sampleContext: sampleMissedCourseMessage,
    },
    person_inactivity_reminder: {
        description: 'Person / Inactive Reminder. User will soon be deleted.',
        sampleContext: {},
    },

    user_authenticate: DEPRECATED,
    user_login_email: DEPRECATED,
    coachee_project_match_success: DEPRECATED,
    coach_project_match_success: DEPRECATED,
    coach_screening_rejection: DEPRECATED,
    coach_screening_success: DEPRECATED,
    coachee_project_match_dissolved: DEPRECATED,
    coach_project_match_dissolved: DEPRECATED,
    codu_student_registration: DEPRECATED,
    mentor_registration_started: DEPRECATED,
    cooperation_tutee_registration_started: DEPRECATED,
    coach_screening_invitation: DEPRECATED,
    feedback_request_student: DEPRECATED,
    feedback_request_pupil: DEPRECATED,
} as const;

// Instead of specifying each action context twice (once as a type and once as a sampleContext value)
// we just derive the type from the sampleContext be replacing concrete string literal types such as 'Student / Match Appointment Updated'
// with their generic counterpart, i.e. string

// The notification system computes some fields automatically, no need to pass them in:
type ComputedField = 'fullName';

type MapLiteralTypeToType<Input> = {
    [K in Exclude<keyof Input, ComputedField>]: Input[K] extends string
        ? string
        : Input[K] extends boolean
        ? boolean
        : Input[K] extends object
        ? MapLiteralTypeToType<Input[K]>
        : never;
};

export type ActionID = keyof typeof _notificationActions;

// Unlike NotificationContext which is just typed as { [any: string]: string }, this type derives concrete key value pairs from the sampleContexts above
export type SpecificNotificationContext<ID extends ActionID> = MapLiteralTypeToType<(typeof _notificationActions)[ID]['sampleContext']> &
    NotificationContextExtensions;

const notificationActions: { readonly [actionId: string]: Omit<NotificationAction, 'id'> } = _notificationActions;

export function getNotificationActions(): NotificationAction[] {
    return Object.entries(notificationActions).map(([id, it]) => ({
        ...it,
        id,
        sampleContext: {
            ...(it.sampleContext ?? {}),
            user: sampleUser,
        },
    }));
}
