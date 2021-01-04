import { TuteeJufoParticipationIndication, TutorJufoParticipationIndication } from "../../../common/jufo/participationIndication";
import { ProjectField } from "../../../common/jufo/projectFields";

/**
 * @apiDefine AddTutor
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Tutor Object) {string} firstname First name
 * @apiSuccess (Tutor Object) {string} lastname Last name
 * @apiSuccess (Tutor Object) {string} email E-Mail
 * @apiSuccess (Tutor Object) {string} phone Phone number
 * @apiSuccess (Tutor Object) {bool} isTutor True, if eligible for one-on-one matching
 * @apiSuccess (Tutor Object) {bool} isInstructor True, if eligible for course management
 * @apiSuccess (Tutor Object) {Subject[]} subjects <em>required if</em> <code>isTutor = true</code>: Subjects
 * @apiSuccess (Tutor Object) {bool} isOfficial True, if user is looking for something official
 * @apiSuccess (Tutor Object) {string} state <em>required if</em> <code>isOfficial = true</code>: State, one of <code>"bw", "by", "be", "bb", "hb", "hh", "he", "mv", "ni", "nw", "rp", "sl", "sn", "st", "sh", "th", "other"</code>
 * @apiSuccess (Tutor Object) {string} university <em>required if</em> <code>isOfficial = true</code>: University
 * @apiSuccess (Tutor Object) {string} module <em>required if</em> <code>isOfficial = true</code>: Module, one of <code>"internship", "seminar", "other"</code>
 * @apiSuccess (Tutor Object) {int} hours <em>required if</em> <code>isOfficial = true</code>: Hours needed > 0
 * @apiSuccess (Tutor Object) {bool} newsletter Opt-in for newsletter
 * @apiSuccess (Tutor Object) {string} msg Additional information
 * @apiSuccess (Tutor Object) {string|undefined} redirectTo the page the user sees after registration
 * @apiSuccess (Tutor Object) {bool} isProjectCoach True, if eligible for project coaching
 * @apiSuccess (Tutor Object) {bool} [isUniversityStudent] (for project coaching required) True, if tutor is a university student
 * @apiSuccess (Tutor Object) {string} [wasJufoParticipant] (for project coaching required) One of <code> "yes", "no", "idk" </code>
 * @apiSuccess (Tutor Object) {boolean} [hasJufoCertificate] (for project coaching required) One of <code> "yes", "no", "idk" </code>
 * @apiSuccess (Tutor Object) {string[]} [projectFields] (for project coaching required) An array of strings with identifiers to the project fields if isProjectCoach is true. One of <code>"Arbeitswelt", "Biologie", "Chemie", "Geo-und-Raumwissenschaften", "Mathematik/Informatik", "Physik", "Technik"</code>
 * @apiSuccess (Tutor Object) {string} [jufoPastParticipationInfo] (for project coaching sometimes required) An open text field that can be used to give any information on a past jufo participation in a very informal way.
 *
 */
import {ApiSubject} from "../format";

export interface ApiAddTutor {
    firstname: string,
    lastname: string,
    email: string
    phone: string,
    isTutor: boolean,
    isInstructor: boolean,
    subjects?: ApiSubject[],
    isOfficial: boolean,
    state?: string,
    university?: string,
    module?: string,
    hours?: number,
    newsletter: boolean,
    msg: string,
    redirectTo?: string;
    isProjectCoach: boolean,
    isUniversityStudent?: boolean,
    projectFields?: ProjectField[],
    wasJufoParticipant?: TutorJufoParticipationIndication,
    hasJufoCertificate?: boolean,
    jufoPastParticipationInfo?: string
}

/**
 * @apiDefine AddTutee
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Tutee Object) {string} firstname First name
 * @apiSuccess (Tutee Object) {string} lastname Last name
 * @apiSuccess (Tutee Object) {string} email E-Mail
 * @apiSuccess (Tutee Object) {string} phone Phone number
 * @apiSuccess (Tutee Object) {int} [grade] Grade of the pupil (required if not only registering for project coaching)
 * @apiSuccess (Tutee Object) {string} state State, one of <code>"bw", "by", "be", "bb", "hb", "hh", "he", "mv", "ni", "nw", "rp", "sl", "sn", "st", "sh", "th", "other"</code>
 * @apiSuccess (Tutee Object) {string} school School type, one of <code>"grundschule", "gesamtschule", "hauptschule", "realschule", "gymnasium", "förderschule", "berufsschule", "other"</code>
 * @apiSuccess (Tutee Object) {bool} isTutee True, if eligible for one-on-one matching
 * @apiSuccess (Tutee Object) {Subject[]} subjects <em>required if</em> <code>isTutor = true</code>: Subjects
 * @apiSuccess (Tutee Object) {bool} newsletter Opt-in for newsletter
 * @apiSuccess (Tutee Object) {string} msg Additional information
 * @apiSuccess (Tutee Object) {string|undefined} redirectTo the page the user sees after registration
 * @apiSuccess (Tutee Object) {bool} isProjectCoachee True, if participating in project coaching
 * @apiSuccess (Tutee Object) {string[]} [isJufoParticipant] (for project coaching required) One of <code> "yes", "no", "unsure", "neverheard" </code>
 * @apiSuccess (Tutee Object) {string} [projectFields] (for project coaching required) An array of strings with identifiers to the project fields if isProjectCoachee is true. One of <code>"Arbeitswelt", "Biologie", "Chemie", "Geo-und-Raumwissenschaften", "Mathematik/Informatik", "Physik", "Technik"</code>
 * @apiSuccess (Tutee Object) {number} [projectMemberCount] (for project coaching required) A number of persons that are making the project together. Values between 1 and 3 are allowed.
 */
export interface ApiAddTutee {
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    grade?: number,
    state: string,
    school: string,
    isTutee: boolean,
    subjects?: ApiSubject[],
    newsletter: boolean,
    msg: string,
    redirectTo?: string;
    isProjectCoachee: boolean;
    projectFields?: ProjectField[];
    isJufoParticipant?: TuteeJufoParticipationIndication;
    projectMemberCount?: number;
}

/**
 * @apiDefine AddStateTutee
 * @apiVersion 1.1.0
 *
 * @apiSuccess (StateTutee Object) {string} firstname First name
 * @apiSuccess (StateTutee Object) {string} lastname Last name
 * @apiSuccess (StateTutee Object) {string} email E-Mail
 * @apiSuccess (StateTutee Object) {string} phone Phone number
 * @apiSuccess (StateTutee Object) {int} grade Grade of the pupil
 * @apiSuccess (StateTutee Object) {string} state State, one of <code>"bw", "by", "be", "bb", "hb", "hh", "he", "mv", "ni", "nw", "rp", "sl", "sn", "st", "sh", "th", "other"</code>
 * @apiSuccess (StateTutee Object) {bool} isTutee True, if eligible for one-on-one matching
 * @apiSuccess (StateTutee Object) {Subject[]} subjects <em>required if</em> <code>isTutor = true</code>: Subjects
 * @apiSuccess (StateTutee Object) {bool} newsletter Opt-in for newsletter
 * @apiSuccess (StateTutee Object) {string} msg Additional information
 * @apiSuccess (StateTutee Object) {string} teacherEmail The email address of the teacher as part of cooperation with one of Germany's states
 * @apiSuccess (StateTutee Object) {string|undefined} redirectTo the page the user sees after registration
 */
export interface ApiAddStateTutee {
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    grade: number,
    state: string,
    isTutee: boolean,
    subjects?: ApiSubject[],
    newsletter: boolean,
    msg: string,
    teacherEmail: string,
    redirectTo?: string;
    isProjectCoachee: boolean;
    projectFields?: ProjectField[];
    isJufoParticipant?: TuteeJufoParticipationIndication;
    projectMemberCount?: number;
}

/**
 * @apiDefine AddMentor
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Mentor Object) {string} firstname First name
 * @apiSuccess (Mentor Object) {string} lastname Last name
 * @apiSuccess (Mentor Object) {string} email E-Mail
 * @apiSuccess (Mentor Object) {string} Phone Phone number
 * @apiSuccess (Mentor Object) {string[]} division Division, array of <code>"facebook", "email", "events", "video", "supervision"</code>
 * @apiSuccess (Mentor Object) {string[]} expertise Expertise, array of <code>"language_difficulties", "specialized_subject_experience", "didactic_expert", "technical_support", "self_organization"</code>
 * @apiSuccess (Mentor Object) {Subject[]} subjects Subjects, <em>required if</em> <code>division = "supervision"</code> or <code>expertise = "specialized_subject_experience"</code>
 * @apiSuccess (Mentor Object) {bool} teachingExperience User reports existing teaching experience
 * @apiSuccess (Mentor Object) {string} message Additional message
 * @apiSuccess (Mentor Object) {string} description Additional description
 * @apiSuccess (Mentor Object) {string|undefined} redirectTo the page the user sees after registration
 *
 */
export interface ApiAddMentor {
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    division: string[],
    expertise: string[],
    subjects?: ApiSubject[],
    teachingExperience?: boolean,
    message: string,
    description: string,
    redirectTo?: string;
}

/**
 * @apiDefine SchoolInfo
 * @apiVersion 1.1.0
 *
 * @apiSuccess (SchoolInfo Object) {string} name School's name
 * @apiSuccess (SchoolInfo Object) {string} emailDomain School's email address domain
 */
export interface ApiSchoolInfo {
    name: string,
    emailDomain: string
}
