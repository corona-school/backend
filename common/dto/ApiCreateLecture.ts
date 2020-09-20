import { isDate } from "moment";

export class ApiCreateLecture {
    subcourse: { id: number };
    instructor: { id: number };
    start: Date;
    duration: number;

    constructor({subcourse, instructor, start, duration }: any) {
        this.subcourse = { id: subcourse.id };
        this.instructor = { id: instructor.id };
        this.start = new Date(start);
        this.duration = duration;
    }

    isValid () {
        return is<ApiCreateLecture>(
            value => typeof value.subcourse.id === "number",
            value => typeof value.instructor.id === "number",
            value => isDate(value.start),
            value => typeof value.duration === "number"
        );
    }
}

/* Helper functions for data validation, usage as above */
const is = <T>(...checks: ((value: T) => boolean)[]) => (value: T) => checks.every(check => check(value));

