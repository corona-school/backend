function removeStudentWithEmail(arr, email) {
    return arr.filter((s) => s.email != email);
}
function removePupilWithEmail(arr, email) {
    return removeStudentWithEmail(arr, email); //the same as for students
}

//array intersection
function gradeAsInt(gradeStr: string) {
    return parseInt(gradeStr.substring(0, gradeStr.search(/\D/)));
}

//array intersection
function intersection<T>(arrA: T[], arrB: T[]) {
    return arrA.filter((x) => arrB.includes(x));
}

function splitAtIndex(s: string, index: number): [string, string] {
    return [s.substring(0, index), s.substring(index)];
}

function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export {
    intersection,
    removeStudentWithEmail,
    removePupilWithEmail,
    randomIntFromInterval,
    splitAtIndex,
    gradeAsInt,
};
