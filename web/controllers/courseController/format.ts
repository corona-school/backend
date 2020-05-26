/**
 * @apiDefine Courses
 *
 * @apiSuccess (Courses Object) {Course[]} root Array of all courses
 */

/**
 * @apiDefine PostCourseReturn
 *
 * @apiSuccess (Course Return Object) {int} id Unique identifier for this course
 */

/**
 * @apiDefine Course
 *
 * @apiSuccess (Course Object) {int} id Unique identifier for this course
 * @apiSuccess (Course Object) {string?} instructor Name of the instructor for this course
 * @apiSuccess (Course Object) {string?} name Name of this course
 * @apiSuccess (Course Object) {string?} outline Outline of this course
 * @apiSuccess (Course Object) {string?} description Description of this course
 * @apiSuccess (Course Object) {string?} motivation Motivation of this course
 * @apiSuccess (Course Object) {string?|null} image URL of an associated image
 * @apiSuccess (Course Object) {int?} minGrade Minimum grade (>= 1) of participants
 * @apiSuccess (Course Object) {int?} maxGrade Maximum grade (<= 13) of participants
 * @apiSuccess (Course Object) {int?} maxParticipants Maximum count of participants
 * @apiSuccess (Course Object) {string?} category Category of this course
 * @apiSuccess (Course Object) {string?} startDate Start Date of this course
 * @apiSuccess (Course Object) {int?} duration Duration (>= 1) of the course (count of days)
 * @apiSuccess (Course Object) {int?} frequency Days (>= 0) <strong>between</strong> single course appointments (so 0 means, the appointments are on consecutive days)
 * @apiSuccess (Course Object) {string?} state One of <code>"created", "submitted", "allowed", "denied", "cancelled"</code>
 *
 */
export interface ApiCourse {
    id: number;
    instructor?: string;
    name?: string;
    outline?: string;
    description?: string;
    motivation?: string;
    image?: string | null;
    minGrade?: number;
    maxGrade?: number;
    maxParticipants?: number;
    category?: string;
    startDate?: string;
    duration?: number;
    frequency?: number;
    state?: string;
}

/**
 * @apiDefine PostCourse
 *
 * @apiSuccess (Course Object) {string} name Name of this course
 * @apiSuccess (Course Object) {string} outline Outline of this course
 * @apiSuccess (Course Object) {string} description Description of this course
 * @apiSuccess (Course Object) {string} motivation Motivation of this course
 * @apiSuccess (Course Object) {int} minGrade Minimum grade (>= 1) of participants
 * @apiSuccess (Course Object) {int} maxGrade Maximum grade (<= 13) of participants
 * @apiSuccess (Course Object) {int} maxParticipants Maximum count of participants
 * @apiSuccess (Course Object) {string} category Category of this course
 * @apiSuccess (Course Object) {string} startDate Start Date of this course
 * @apiSuccess (Course Object) {int} duration Duration (>= 1) of the course (count of days)
 * @apiSuccess (Course Object) {int} frequency Days (>= 0) <strong>between</strong> single course appointments (so 0 means, the appointments are on consecutive days)
 * @apiSuccess (Course Object) {bool} submit If submit is true, the course will be marked as submitted and can't be edited anymore.
 *
 */
export interface ApiAddCourse {
    name: string;
    outline: string;
    description: string;
    motivation: string;
    minGrade: number;
    maxGrade: number;
    maxParticipants: number;
    category: string;
    startDate: string;
    duration: number;
    frequency: number;
    state: string;
}
