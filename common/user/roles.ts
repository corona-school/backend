export enum Role {
    /* Elevated Access via Retool */
    ADMIN = 'ADMIN',
    /* Shortcut role for everyone with an account */
    USER = 'USER',
    /* Elevated Access via Screener Admin Interface */
    SCREENER = 'SCREENER',
    /* A screener who is additionally able to log in with users' accounts */
    TRUSTED_SCREENER = 'TRUSTED_SCREENER',
    /* A screener that can manage courses */
    COURSE_SCREENER = 'COURSE_SCREENER',
    /* A screener that can screen pupils */
    PUPIL_SCREENER = 'PUPIL_SCREENER',
    /* A screener that can screen students */
    STUDENT_SCREENER = 'STUDENT_SCREENER',

    /* Access via User Interface, not yet E-Mail verified */
    PUPIL = 'PUPIL',
    STUDENT = 'STUDENT',
    /* Accessible to everyone */
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    /* User owns the entity as defined in graphql/ownership */
    OWNER = 'OWNER',
    /* No one should have access */
    NOBODY = 'NOBODY',

    /* User is a student, requested to be a tutor (E-Mail also verified) and is a 'wannabe tutor' ... */
    WANNABE_TUTOR = 'WANNABE_TUTOR',
    // ... until they were successfully screened  */
    TUTOR = 'TUTOR',

    /* User is a student, requested to be a course instructor (E-Mail also verified) and is a 'wannabe instructor' ... */
    WANNABE_INSTRUCTOR = 'WANNABE_INSTRUCTOR',
    // ... until they were successfully "instructor screened"  */
    INSTRUCTOR = 'INSTRUCTOR',

    /* User is a student, requested to be a project coach and was successfully screened (E-Mail also verified) */
    PROJECT_COACH = 'PROJECT_COACH',

    /* User is a pupil and requested to receive one-on-one tutoring */
    TUTEE = 'TUTEE',
    /* User is a pupil and requested to participate in courses */
    PARTICIPANT = 'PARTICIPANT',
    /* User is a pupil and requested to participate in project coaching */
    PROJECT_COACHEE = 'PROJECT_COACHEE',
    /* User is a pupil and linked his teacher's email address (matching his school, which is a cooperation school) */
    STATE_PUPIL = 'STATE_PUPIL',
    /* User is a pupil and participant of a specific subcourse */
    SUBCOURSE_PARTICIPANT = 'SUBCOURSE_PARTICIPANT',
    /* User is a pupil and participant of a specific appointment */
    APPOINTMENT_PARTICIPANT = 'APPOINTMENT_PARTICIPANT',
    /** User tried to authenticate with SSO but doesn't have an account yet. They'll need to complete a part of the registration process to continue */
    SSO_REGISTERING_USER = 'SSO_REGISTERING_USER',
}
