/**
 * @apiDefine Courses
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Courses Object) {Course[]} root Array of all courses
 */

/**
 * @apiDefine Course
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Object) {int} id Unique identifier for this course
 * @apiSuccess (Course Object) {Instructor[]} instructors <em>(optional)</em> Information about the instructors of this course
 * @apiSuccess (Course Object) {string} name <em>(optional)</em> Name of this course
 * @apiSuccess (Course Object) {string} outline <em>(optional)</em> Outline of this course
 * @apiSuccess (Course Object) {string} description <em>(optional)</em> Description of this course
 * @apiSuccess (Course Object) {string|null} image <em>(optional)</em> URL of an associated image
 * @apiSuccess (Course Object) {string} category <em>(optional)</em> Category of this course (one of <code>"revision"</code>,<code>"club"</code>,<code>"coaching"</code>)
 * @apiSuccess (Course Object) {CourseTag[]} tags <em>(optional)</em> Tags for this course
 * @apiSuccess (Course Object) {Subcourse[]} subcourses <em>(optional)</em> Array of Subcourses
 * @apiSuccess (Course Object) {string} state <em>(optional)</em> One of <code>"created", "submitted", "allowed", "denied", "cancelled"</code>
 *
 */
// todo adjust interface
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
    joinAfterStart?: boolean;
    startDate?: number;
    duration?: number;
    frequency?: number;
    state?: string;
}

/**
 * @apiDefine Subcourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subcourse Object) {int} id Unique identifier for this subcourse
 * @apiSuccess (Subcourse Object) {Instructor[]} instructors <em>(optional)</em> Information about the instructors of this course
 * @apiSuccess (Subcourse Object) {int} minGrade <em>(optional)</em> Minimum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxGrade <em>(optional)</em> Maximum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxParticipants <em>(optional)</em> Maximum number of participants
 * @apiSuccess (Subcourse Object) {int} participants <em>(optional)</em> Current number of registered participants
 * @apiSuccess (Subcourse Object) {Lecture[]} lectures <em>(optional)</em> Array of lectures
 * @apiSuccess (Subcourse Object) {bool} cancelled <em>(optional)</em> True if subcourse has been cancelled
 *
 */
// todo write interface

/**
 * @apiDefine Lecture
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Lecture Object) {int} start Unix Timestamp of start date
 * @apiSuccess (Lecture Object) {int} duration Duration of the lecture in minutes
 *
 */
// todo write interface

/**
 * @apiDefine PostCourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Object) {string[]} instructors Array of instructor IDs for this course. The authenticated user's ID must be contained
 * @apiSuccess (Course Object) {string} name Name of this course
 * @apiSuccess (Course Object) {string} outline Outline of this course
 * @apiSuccess (Course Object) {string} description Description of this course
 * @apiSuccess (Course Object) {string} category Category of this course (one of <code>"revision"</code>,<code>"club"</code>,<code>"coaching"</code>)
 * @apiSuccess (Course Object) {CourseTag[]} tags Tags for this course
 * @apiSuccess (Course Object) {bool} submit If true set status to submitted. Only restricted editing will be possible afterwards
 *
 */
/**
 * @apiDefine PostCourseReturn
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Return Object) {int} id Unique identifier for this course
 */
// todo adjust interface
export interface ApiAddCourse {
    name: string;
    outline: string;
    description: string;
    motivation: string;
    minGrade: number;
    maxGrade: number;
    maxParticipants: number;
    category: string;
    joinAfterStart: boolean;
    startDate: number;
    duration: number;
    frequency: number;
    submit: boolean;
}

/**
 * @apiDefine PostSubcourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subcourse Object) {string[]} instructors Array of instructor IDs for this subcourse. The authenticated user's ID must not be contained
 * @apiSuccess (Subcourse Object) {int} minGrade Minimum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxGrade Maximum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxParticipants <em>(optional)</em> Maximum number of participants
 *
 */
/**
 * @apiDefine PostSubcourseReturn
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subcourse Return Object) {int} id Unique identifier for this subcourse
 */
// todo write interface

/**
 * @apiDefine PostLecture
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Lecture Object) {string} instructor ID of the instructor for this lecture. Must be contained in the subcourses instructors
 * @apiSuccess (Lecture Object) {int} start Unix Timestamp of start date
 * @apiSuccess (Lecture Object) {int} duration Duration of the lecture in minutes
 *
 */
/**
 * @apiDefine PostLectureReturn
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Lecture Return Object) {int} id Unique identifier for this lecture
 */
// todo write interface

/**
 * @apiDefine PutCourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Object) {string[]} instructors Array of instructor IDs for this course. The authenticated user's ID must be contained
 * @apiSuccess (Course Object) {string} name Name of this course, <em>only if not submitted</em>
 * @apiSuccess (Course Object) {string} outline Outline of this course, <em>only if not submitted</em>
 * @apiSuccess (Course Object) {string} description Description of this course
 * @apiSuccess (Course Object) {string} category Category of this course (one of <code>"revision"</code>,<code>"club"</code>,<code>"coaching"</code>), <em>only if not submitted</em>
 * @apiSuccess (Course Object) {CourseTag[]} tags Tags for this course
 * @apiSuccess (Course Object) {bool} submit If true set status to submitted. Only restricted editing will be possible afterwards, <em>only if not submitted</em>
 *
 */
// todo write interface

/**
 * @apiDefine PutSubcourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subcourse Object) {string[]} instructors Array of instructor IDs for this subcourse. The authenticated user's ID must not be contained
 * @apiSuccess (Subcourse Object) {int} minGrade Minimum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxGrade Maximum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxParticipants Maximum number of participants. May not be lower than the number of already registered participants
 *
 */
// todo write interface

/**
 * @apiDefine PutLecture
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Lecture Object) {string} instructor ID of the instructor for this lecture. Must be contained in the subcourses instructors
 * @apiSuccess (Lecture Object) {int} start Unix Timestamp of start date
 * @apiSuccess (Lecture Object) {int} duration Duration of the lecture in minutes
 *
 */
// todo write interface

/**
 * @apiDefine Instructor
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Instructor Object) {string} firstname First name
 * @apiSuccess (Instructor Object) {string} lastname Last name
 *
 */
// todo write interface

/**
 * @apiDefine CourseTag
 * @apiVersion 1.1.0
 *
 * @apiSuccess (CourseTag Object) {string} id Unique identifier of this tag
 * @apiSuccess (CourseTag Object) {string} name Name used for displaying
 * @apiSuccess (CourseTag Object) {string} category Tags with identical category identifiers should be grouped
 *
 */
// todo write interface
