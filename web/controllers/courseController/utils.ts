import { ApiCourse, ApiLecture, ApiSubcourse } from "./format";


function getLecturesSorted(apiSubcourse: ApiSubcourse) {
    return apiSubcourse.lectures?.sort( (l1, l2) => l1.start - l2.start) ?? [];
}

/// Assumes that this subcourse has at least one lecture
function subcourseStarted(apiSubcourse: ApiSubcourse) {
    const sortedLectures = getLecturesSorted(apiSubcourse);
    return sortedLectures[0].start <= Date.now();
}

function subcourseFinished(apiSubcourse: ApiSubcourse) {
    const sortedLectures = getLecturesSorted(apiSubcourse);
    const lastLecture = sortedLectures[sortedLectures.length - 1];
    return lastLecture.start + lastLecture.duration * 60 <= Date.now();
}

function isJoinableSubcourse(apiSubcourse: ApiSubcourse) {
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
}