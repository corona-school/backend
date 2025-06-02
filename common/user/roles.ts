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
    /* Same as OWNER, but allows temporary users (i.e. without the USER Role) to hold it */
    TEMPORARY_OWNER = 'TEMPORARY_OWNER',

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

    /* User is a pupil and requested to receive one-on-one tutoring */
    TUTEE = 'TUTEE',
    /* User is a pupil and requested to participate in courses */
    PARTICIPANT = 'PARTICIPANT',
    /* User is a pupil and linked his teacher's email address (matching his school, which is a cooperation school) */
    STATE_PUPIL = 'STATE_PUPIL',
    /* User is a pupil and participant of a specific subcourse */
    SUBCOURSE_PARTICIPANT = 'SUBCOURSE_PARTICIPANT',
    /* User is a student and mentor of a specific subcourse */
    SUBCOURSE_MENTOR = 'SUBCOURSE_MENTOR',
    /* User is a pupil and participant of a specific appointment */
    APPOINTMENT_PARTICIPANT = 'APPOINTMENT_PARTICIPANT',
    /**
     * User is trying to authenticate with SSO. It may be that they're registering a new account
     * or trying to link their Lern-Fair account with an IDP
     */
    SSO_REGISTERING_USER = 'SSO_REGISTERING_USER',
    /**
     * User has their Lern-Fair account linked with an IDP
     */
    SSO_USER = 'SSO_USER',
}
