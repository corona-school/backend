export enum Role {
    /* Elevated Access via Retool */
    ADMIN = 'ADMIN',
    /* Shortcut role for everyone with an account */
    USER = 'USER',
    /* Elevated Access via Screener Admin Interface */
    SCREENER = 'SCREENER',
    /* Access via User Interface, not yet E-Mail verified */
    PUPIL = 'PUPIL',
    STUDENT = 'STUDENT',
    /* Accessible to everyone */
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    /* User owns the entity as defined in graphql/ownership */
    OWNER = 'OWNER',
    /* No one should have access */
    NOBODY = 'NOBODY',

    /* User is a student, requested to be a tutor and was successfully screened (E-Mail also verified) */
    TUTOR = 'TUTOR',
    /* User is a student, requested to be a course instructor and was successfully "instructor screened" (E-Mail also verified) */
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
}
