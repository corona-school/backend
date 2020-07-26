import { CourseCategory, CourseState } from "../../common/entity/Course";

export class ApiCourseUpdate {
    courseState?: CourseState.ALLOWED | CourseState.DENIED | CourseState.CANCELLED;
    name?: string;
    description?: string;
    outline?: string;
    category?: CourseCategory;
    imageUrl?: string | null;
    screeningComment?: string | null;
    instructors?: { id: number }[];

    constructor({ courseState, name, description, category, outline, imageUrl, screeningComment, instructors }: any) {
        this.courseState = courseState;
        this.name = name;
        this.description = description;
        this.category = category;
        this.outline = outline;
        this.imageUrl = imageUrl;
        this.screeningComment = screeningComment;
        this.instructors = instructors;
    }

    isValid() {
        return is<ApiCourseUpdate>(
            isValue("courseState", [CourseState.ALLOWED, CourseState.CANCELLED, CourseState.DENIED, undefined]),
            isType("name", ["undefined", "string"]),
            isType("description", ["undefined", "string"]),
            isValue("category", [CourseCategory.CLUB, CourseCategory.COACHING, CourseCategory.REVISION, undefined]),
            isType("outline", ["undefined", "string"]),
            value => value.imageUrl === undefined || value.imageUrl === null || typeof value.imageUrl === "string",
            value => value.screeningComment === undefined || value.screeningComment === null || typeof value.screeningComment === "string",
            value => value.instructors === undefined || (Array.isArray(value.instructors) && value.instructors.every(it => Number.isInteger(it.id)))
        )(this);
    }
}

/* Helper functions for data validation, usage as above */
const is = <T>(...checks: ((value: T) => boolean)[]) => (value: T) => checks.every(check => check(value));
const isType = <T>(key: keyof T, types: ("string" | "number" | "undefined" | "boolean")[]) => (value: T) => types.indexOf(typeof value[key] as any) !== -1;
const isValue = <T, K extends keyof T>(key: K, should: T[K][]) => (value: T) => should.indexOf(value[key]) !== -1;