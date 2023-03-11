// Actions mark a certain event that a user triggered and which sends out notifications, schedules or cancels reminders
// In the backend actions are only their 'id' which is stored in the Notification entity,
//  however a few other attributes of the action are maintained here to provide admin users with better tooling
//  for creating notifications for these actions. The ones documented here are incomplete

type NestedStringObject = { [key: string]: string | NestedStringObject };

export interface NotificationAction {
    readonly id: string;
    readonly description: string;
    readonly sampleContext?: NestedStringObject;
    readonly recommendedCancelations?: readonly string[];
}

const sampleUser = { firstname: 'Max', fullName: 'Max Mustermann' };

const DEPRECATED = {
    description: 'DEPRECATED - DO NOT USE',
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
    },
    pupil_screening_add: {
        description: 'Pupil / Screening was added',
    },
    pupil_screening_rejected: {
        description: 'Pupil / Screening was rejected',
    },
    pupil_screening_succeeded: {
        description: 'Pupil / Screening was successful',
    },
    pupil_registration_finished: {
        description: 'Pupil / Registration finished',
    },
    tutor_screening_invitation: {
        description: 'Tutor / Was invited for screening',
    },
    tutor_screening_success: {
        description: 'Tutor / Screening was successful',
    },
    tutor_screening_rejection: {
        description: 'Tutor / Screening was rejected',
    },
    instructor_screening_invitation: {
        description: 'Instructor was invited for screening',
    },
    instructor_screening_success: {
        description: 'Instructor / Screening was successful',
    },
    instructor_screening_rejection: {
        description: 'Instructor / Screening was rejected',
    },
    participant_course_joined: {
        description: 'Participant / Joined Course',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
        recommendedCancelations: ['participant_course_leave', 'participant_course_cancelled'],
    },
    participant_course_cancelled: {
        description: 'Participant / Course was cancelled',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    participant_course_waiting_list_join: {
        description: 'Participant / Joined Waitinglist of Course',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
        recommendedCancelations: ['participant_course_waiting_list_leave'],
    },
    participant_course_leave: {
        description: 'Participant / Joined Course',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    participant_course_waiting_list_leave: {
        description: 'Participant / Left Waitinglist of Course',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    participant_subcourse_reminder: {
        description: 'Participant / Course starts soon',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_course_created: {
        description: 'Instructor / Course created (not yet published)',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_course_cancelled: {
        description: 'Instructor / Course cancelled',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_course_published: {
        description: 'Instructor / Course published',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_course_reminder: {
        description: 'Instructor / Course starts soon',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Kurs',
            },
        },
    },
    instructor_subcourse_published: {
        description: 'Instructor / Subcourse published',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Subkurs',
            },
        },
    },
    available_places_on_subcourse: {
        description: 'Instructor / Available places on subcourse',
        sampleContext: {
            course: {
                title: 'Hallo Welt',
                description: 'Ein Subkurs',
            },
        },
    },
    student_certificate_sign: {
        description: 'Student / Tutoring Certificate was signed',
        sampleContext: {
            pupil: sampleUser,
        },
    },
    pupil_certificate_approval: {
        description: 'Pupil / Tutoring Certificate needs approval',
        sampleContext: {
            student: sampleUser,
        },
    },
    tutee_match_dissolved_other: {
        description: 'Tutee / Match was dissolved by student',
        sampleContext: {
            student: sampleUser,
        },
    },
    tutee_match_dissolved: {
        description: 'Tutee / Match was dissolved',
        sampleContext: {
            student: sampleUser,
        },
    },
    tutor_match_dissolved_other: {
        description: 'Tutor / Match was dissolved by pupil',
        sampleContext: {
            pupil: sampleUser,
        },
    },
    tutor_match_dissolved: {
        description: 'Tutor / Match was dissolved',
        sampleContext: {
            pupil: sampleUser,
        },
    },
    tutee_matching_success: {
        description: 'Tutee / Match success',
        sampleContext: {
            student: sampleUser,
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
    },
    tutee_matching_confirm_interest_reminder: {
        description: 'Tutee / Confirm Interest Reminder',
    },

    student_coc_updated: {
        description: 'Student / Certificate of Conduct handed in',
    },
    coc_reminder: {
        description: 'Student / Certificate of Conduct Request',
    },

    instructor_course_participant_message: {
        description: 'Instructor / Course Message from Participant',
    },
    participant_course_message: {
        description: 'Participant / Course Message from Instructor',
    },

    pupil_account_deactivated: {
        description: 'Pupil / Account deactivated',
    },
    student_account_deactivated: {
        description: 'Student / Account deactivated',
    },

    'user-verify-email': {
        description: 'User / Verify E-Mail',
    },
    'user-authenticate': {
        description: 'User / Login',
    },
    'user-password-reset': {
        description: 'User / Reset Password',
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

export type ActionID = keyof typeof _notificationActions;
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
