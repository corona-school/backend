/**
 * @apiDefine Courses
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Courses Object) {Course[]} root Array of all courses
 */

/**
 * @apiDefine PostCourseReturn
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Return Object) {int} id Unique identifier for this course
 */

/**
 * @apiDefine Course
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Object) {int} id Unique identifier for this course
 * @apiSuccess (Course Object) {string} instructor <em>(optional)</em> Name of the instructor for this course
 * @apiSuccess (Course Object) {string} name <em>(optional)</em> Name of this course
 * @apiSuccess (Course Object) {string} outline <em>(optional)</em> Outline of this course
 * @apiSuccess (Course Object) {string} description <em>(optional)</em> Description of this course
 * @apiSuccess (Course Object) {string} motivation <em>(optional)</em> Motivation of this course
 * @apiSuccess (Course Object) {string|null} image <em>(optional)</em> URL of an associated image
 * @apiSuccess (Course Object) {int} minGrade <em>(optional)</em> Minimum grade (>= 1) of participants
 * @apiSuccess (Course Object) {int} maxGrade <em>(optional)</em> Maximum grade (<= 13) of participants
 * @apiSuccess (Course Object) {int} maxParticipants <em>(optional)</em> Maximum count of participants
 * @apiSuccess (Course Object) {string} category <em>(optional)</em> Category of this course
 * @apiSuccess (Course Object) {string} startDate <em>(optional)</em> Start Date of this course
 * @apiSuccess (Course Object) {int} duration <em>(optional)</em> Duration (>= 1) of the course (count of days)
 * @apiSuccess (Course Object) {int} frequency <em>(optional)</em> Days (>= 0) <strong>between</strong> single course appointments (so 0 means, the appointments are on consecutive days)
 * @apiSuccess (Course Object) {string} state <em>(optional)</em> One of <code>"created", "submitted", "allowed", "denied", "cancelled"</code>
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
 * @apiVersion 1.1.0
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
