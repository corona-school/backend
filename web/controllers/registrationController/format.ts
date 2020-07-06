/**
 * @apiDefine AddTutor
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Tutor Object) {string} firstname First name
 * @apiSuccess (Tutor Object) {string} lastname Last name
 * @apiSuccess (Tutor Object) {string} email E-Mail
 * @apiSuccess (Tutor Object) {bool} isTutor True, if eligible for one-on-one matching
 * @apiSuccess (Tutor Object) {bool} isInstructor True, if eligible for course management
 * @apiSuccess (Tutor Object) {Subject[]} subjects <em>required if</em> <code>isTutor = true</code>: Subjects
 * @apiSuccess (Tutor Object) {bool} isOfficial True, if user is looking for something official
 * @apiSuccess (Tutor Object) {string} university <em>required if</em> <code>isOfficial = true</code>: University
 * @apiSuccess (Tutor Object) {string} module <em>required if</em> <code>isOfficial = true</code>: Module, one of <code>"internship", "seminar"</code>
 * @apiSuccess (Tutor Object) {int} hours <em>required if</em> <code>isOfficial = true</code>: Hours needed > 0
 * @apiSuccess (Tutor Object) {bool} newsletter Opt-in for newsletter
 * @apiSuccess (Tutor Object) {string} msg Additional information
 *
 */
export interface ApiAddTutor {
    firstname: string,
    lastname: string,
    email: string
    isTutor: boolean,
    isInstructor: boolean,
    subjects?: ApiAddTutorSubject[],
    isOfficial: boolean,
    university?: string,
    module?: string,
    hours?: number,
    newsletter: boolean,
    msg: string
}

/**
 * @apiDefine AddTutee
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Tutee Object) {string} firstname First name
 * @apiSuccess (Tutee Object) {string} lastname Last name
 * @apiSuccess (Tutee Object) {string} email E-Mail
 * @apiSuccess (Tutee Object) {int} grade Grade of the pupil
 * @apiSuccess (Tutee Object) {string} state State, one of <code>"bw", "by", "be", "bb", "hb", "hh", "he", "mv", "ni", "nw", "rp", "sl", "sn", "st", "sh", "th", "other"</code>
 * @apiSuccess (Tutee Object) {string} school School type, one of <code>"grundschule", "gesamtschule", "hauptschule", "realschule", "gymnasium", "förderschule", "other"</code>
 * @apiSuccess (Tutee Object) {bool} isTutee True, if eligible for one-on-one matching
 * @apiSuccess (Tutee Object) {Subject[]} subjects <em>required if</em> <code>isTutor = true</code>: Subjects
 * @apiSuccess (Tutee Object) {bool} newsletter Opt-in for newsletter
 * @apiSuccess (Tutee Object) {string} msg Additional information
 *
 */
export interface ApiAddTutee {
    firstname: string,
    lastname: string,
    email: string,
    grade: number,
    state: string,
    school: string,
    isTutee: boolean,
    subjects?: ApiAddTuteeSubject[],
    newsletter: boolean,
    msg: string
}

/**
 * @apiDefine AddTutorSubject
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subject Object) {string} name Name of the subject
 * @apiSuccess (Subject Object) {int} minGrade Minimum grade
 * @apiSuccess (Subject Object) {int} maxGrade Maximum grade
 *
 */
export interface ApiAddTutorSubject {
    name: string,
    minGrade: number,
    maxGrade: number
}

/**
 * @apiDefine AddTuteeSubject
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subject Object) {string} name Name of the subject
 *
 */
export interface ApiAddTuteeSubject {
    name: string
}

/**
 * @apiDefine AddMentor
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Mentor Object) {string} firstname First name
 * @apiSuccess (Mentor Object) {string} lastname Last name
 * @apiSuccess (Mentor Object) {string} email E-Mail
 * @apiSuccess (Mentor Object) {string[]} division Division, array of <code>"facebook", "email", "events", "video", "supervision"</code>
 * @apiSuccess (Mentor Object) {string[]} expertise Expertise, array of <code>"language_difficulties", "specialized_subject_experience", "didactic_expert", "technical_support", "self_organization"</code>
 * @apiSuccess (Mentor Object) {Subject[]} subjects Subjects, <em>required if</em> <code>division = "supervision"</code> or <code>expertise = "specialized_subject_experience"</code>
 * @apiSuccess (Mentor Object) {bool} teachingExperience User reports existing teaching experience
 * @apiSuccess (Mentor Object) {string} message Additional message
 *
 */
export interface ApiAddMentor {
    firstname: string,
    lastname: string,
    email: string,
    division: string[],
    expertise: string[],
    subjects: ApiAddMentorSubject[],
}

/**
 * @apiDefine AddMentorSubject
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subject Object) {string} name Name of the subject
 *
 */
export interface ApiAddMentorSubject {
    name: string
}