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
 * @apiSuccess (Course Object) {string} state <em>(optional, requires authentication)</em> One of <code>"created", "submitted", "allowed", "denied", "cancelled"</code>
 *
 */
export interface ApiCourse {
    id: number;
    instructors?: ApiInstructor[];
    name?: string;
    outline?: string;
    description?: string;
    image?: string | null;
    category?: string;
    tags?: ApiCourseTag[];
    subcourses?: ApiSubcourse[];
    state?: string;
}

/**
 * @apiDefine Subcourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subcourse Object) {int} id Unique identifier for this subcourse
 * @apiSuccess (Subcourse Object) {Instructor[]} instructors Information about the instructors of this course
 * @apiSuccess (Subcourse Object) {int} minGrade Minimum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxGrade Maximum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxParticipants Maximum number of participants
 * @apiSuccess (Subcourse Object) {int} participants Current number of registered participants
 * @apiSuccess (Subcourse Object) {Lecture[]} lectures Array of lectures
 * @apiSuccess (Subcourse Object) {bool} published <em>(requires authentication)</em> False if subcourse has not yet been published
 * @apiSuccess (Subcourse Object) {bool} cancelled True if subcourse has been cancelled
 *
 */
export interface ApiSubcourse {
    id: number;
    instructors?: ApiInstructor[];
    minGrade?: number;
    maxGrade?: number;
    maxParticipants?: number;
    participants?: number;
    lectures?: ApiLecture[];
    published?: boolean;
    cancelled?: boolean;
}

/**
 * @apiDefine Lecture
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Lecture Object) {int} id ID of the lecture
 * @apiSuccess (Lecture Object) {Instructor} instructor Instructor of the lecture
 * @apiSuccess (Lecture Object) {int} start Unix Timestamp of start date
 * @apiSuccess (Lecture Object) {int} duration Duration of the lecture in minutes
 *
 */
export interface ApiLecture {
    id: number;
    instructor: ApiInstructor;
    start: number;
    duration: number;
}

/**
 * @apiDefine PostCourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Object) {string[]} instructors Array of instructor IDs for this course. The authenticated user's ID must be contained
 * @apiSuccess (Course Object) {string} name Name of this course
 * @apiSuccess (Course Object) {string} outline Outline of this course
 * @apiSuccess (Course Object) {string} description Description of this course
 * @apiSuccess (Course Object) {string} category Category of this course (one of <code>"revision"</code>,<code>"club"</code>,<code>"coaching"</code>)
 * @apiSuccess (Course Object) {string[]} tags Tag identifiers for this course
 * @apiSuccess (Course Object) {bool} submit If true set status to submitted. Only restricted editing will be possible afterwards
 *
 */
/**
 * @apiDefine PostCourseReturn
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Return Object) {int} id Unique identifier for this course
 */
export interface ApiAddCourse {
    instructors: string[];
    name: string;
    outline: string;
    description: string;
    category: string;
    tags: string[];
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
 * @apiSuccess (Subcourse Object) {bool} published If published, the subcourse can't be easily cancelled and will appear in the public list
 *
 */
/**
 * @apiDefine PostSubcourseReturn
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subcourse Return Object) {int} id Unique identifier for this subcourse
 */
export interface ApiAddSubcourse {
    instructors: string[];
    minGrade: number;
    maxGrade: number;
    maxParticipants: number;
    published: boolean;
}

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
export interface ApiAddLecture {
    instructor: string;
    start: number;
    duration: number;
}

/**
 * @apiDefine PutCourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Course Object) {string[]} instructors Array of instructor IDs for this course. The authenticated user's ID must be contained
 * @apiSuccess (Course Object) {string} name <em>(optional)</em> Name of this course, <em>only if not submitted</em>
 * @apiSuccess (Course Object) {string} outline <em>(optional)</em> Outline of this course, <em>only if not submitted</em>
 * @apiSuccess (Course Object) {string} description Description of this course
 * @apiSuccess (Course Object) {string} category <em>(optional)</em> Category of this course (one of <code>"revision"</code>,<code>"club"</code>,<code>"coaching"</code>), <em>only if not submitted</em>
 * @apiSuccess (Course Object) {string[]} tags Tag identifiers for this course
 * @apiSuccess (Course Object) {bool} submit <em>(optional)</em> If true set status to submitted. Only restricted editing will be possible afterwards, <em>only if not submitted</em>
 *
 */
export interface ApiEditCourse {
    instructors: string[];
    name?: string;
    outline?: string;
    description: string;
    category?: string;
    tags: string[];
    submit?: boolean;
}

/**
 * @apiDefine PutSubcourse
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Subcourse Object) {string[]} instructors Array of instructor IDs for this subcourse. The authenticated user's ID must not be contained
 * @apiSuccess (Subcourse Object) {int} minGrade Minimum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxGrade Maximum grade of participants
 * @apiSuccess (Subcourse Object) {int} maxParticipants Maximum number of participants. May not be lower than the number of already registered participants
 * @apiSuccess (Subcourse Object) {bool} published If published, the subcourse can't be easily cancelled and will appear in the public list. Once published it can't be unpublished
 *
 */
export interface ApiEditSubcourse {
    instructors: string[];
    minGrade: number;
    maxGrade: number;
    maxParticipants: number;
    published: boolean;
}

/**
 * @apiDefine PutLecture
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Lecture Object) {string} instructor ID of the instructor for this lecture. Must be contained in the subcourses instructors
 * @apiSuccess (Lecture Object) {int} start Unix Timestamp of start date
 * @apiSuccess (Lecture Object) {int} duration Duration of the lecture in minutes
 *
 */
export interface ApiEditLecture {
    instructor: string;
    start: number;
    duration: number;
}

/**
 * @apiDefine Instructor
 * @apiVersion 1.1.0
 *
 * @apiSuccess (Instructor Object) {string} id ID of the instructor. Will automatically be included in authorized requests.
 * @apiSuccess (Instructor Object) {string} firstname First name
 * @apiSuccess (Instructor Object) {string} lastname Last name
 *
 */
export interface ApiInstructor {
    id?: string;
    firstname: string;
    lastname: string;
}

/**
 * @apiDefine CourseTag
 * @apiVersion 1.1.0
 *
 * @apiSuccess (CourseTag Object) {string} id Unique identifier of this tag
 * @apiSuccess (CourseTag Object) {string} name Name used for displaying
 * @apiSuccess (CourseTag Object) {string} category Tags with identical category identifiers should be grouped
 *
 */
export interface ApiCourseTag {
    id: string;
    name: string;
    category: string;
}
