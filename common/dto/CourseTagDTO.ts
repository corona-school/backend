import {CourseTag} from "../entity/CourseTag";

export class CourseTagDTO {
    identifier?: string;
    name: string;
    category?: string;
    courses: number[];

    // eslint-disable-next-line
    constructor(courseTag: CourseTag | {identifier: string, name: string, category: string, course_tags_course_tag: {courseId: number}[]}) {
        this.identifier = courseTag.identifier;
        this.name = courseTag.name;
        this.category = courseTag.category;
        this.courses = courseTag instanceof CourseTag ? courseTag?.courses.map(c => c.id) : courseTag.course_tags_course_tag.map(c => c.courseId);
    }

    isValid(): boolean {
        const validIdentifier = this.identifier ? typeof this.identifier === "string" : true;

        const validName = typeof this.name === "string";

        const validCategory = this.category ? typeof this.category === "string" : true;

        const validCourses = this.courses ? Array.isArray(this.courses) && this.courses.every(it => Number.isInteger(it)) : true;

        return validIdentifier && validName && validCategory && validCourses;
    }
}