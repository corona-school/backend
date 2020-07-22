import { ApiCourse, ApiLecture, ApiSubcourse } from "./format";
import * as moment from "moment-timezone"


function getLecturesSorted(apiSubcourse: ApiSubcourse) {
    return apiSubcourse.lectures?.sort( (l1, l2) => l1.start - l2.start) ?? [];
}

/// Assumes that this subcourse has at least one lecture
function subcourseStarted(apiSubcourse: ApiSubcourse) {
    if (!apiSubcourse.lectures || apiSubcourse.lectures.length === 0) {
        throw new Error(`Cannot compute whether subcourse has started or not for a subcourse with no lectures (subcourse ID ${apiSubcourse.id})`);
    }
    const sortedLectures = getLecturesSorted(apiSubcourse);
    return moment.unix(sortedLectures[0].start).isSameOrBefore(Date.now());
}

function subcourseFinished(apiSubcourse: ApiSubcourse) {
    if (!apiSubcourse.lectures || apiSubcourse.lectures.length === 0) {
        throw new Error(`Cannot compute whether subcourse is finished or not for a subcourse with no lectures (subcourse ID ${apiSubcourse.id})`);
    }
    const sortedLectures = getLecturesSorted(apiSubcourse);
    const lastLecture = sortedLectures[sortedLectures.length - 1];
    return moment.unix(lastLecture.start).add(lastLecture.duration, "minutes").isSameOrBefore(Date.now());
}

function isJoinableSubcourse(apiSubcourse: ApiSubcourse) {
    if (!apiSubcourse.lectures || apiSubcourse.lectures.length === 0) {
        return false; //subcourses without lectures are never joinable
    }

    const started = subcourseStarted(apiSubcourse);
    const finished = subcourseFinished(apiSubcourse);
    const joinAfterStart = apiSubcourse.joinAfterStart;
    return !started || (started && !finished && joinAfterStart);
}

function isJoinableCourse(apiCourse: ApiCourse): boolean {
    return apiCourse.subcourses?.some(isJoinableSubcourse) ?? false;
}

export {
    isJoinableCourse,
    isJoinableSubcourse,
    subcourseStarted,
    subcourseFinished,
    getLecturesSorted
};