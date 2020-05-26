import { splitAtIndex, intersection } from "../utils";

//subject string to array
function subjectsAsArray(subjectsString: string): string[] {
    if (subjectsString === undefined) {
        return []; //empty array only
    }

    return JSON.parse(subjectsString);
}

function isSubjectWithGradeDetail(subject: string) {
    return subject.includes(":");
}

const defaultLowerGrade = 1;
const defaultUpperGrade = 13;
function addDefaultGradeDetailToSubjectIfPossible(subject: string) {
    if (isSubjectWithGradeDetail(subject)) {
        return subject; //nothing to do
    }
    return `${subject}${defaultLowerGrade}:${defaultUpperGrade}`;
}

function convertToSubjectWithGradeDetail(extendedSubjectString: string) {
    //if it contains a grade / if it really is an extended subject string
    let name = extendedSubjectString;
    let grade = null; //per default

    if (isSubjectWithGradeDetail(name)) {
        //parse extended subject string
        const firstDigitIndex = name.search(/\d/);
        const r = splitAtIndex(name, firstDigitIndex);
        name = r[0];
        const limits = r[1].split(":");
        grade = {
            lower: parseInt(limits[0]),
            upper: parseInt(limits[1]),
        };
    }

    //return the subject-with-grade-detail-object
    return {
        name: name,
        grade: grade,
    };
}

///transforms a given array of subjects into a unified form
///if it is invalid, it will throw an error
function unifiedFormOfSubjects(subjects: string[]) {
    return subjects.map(addDefaultGradeDetailToSubjectIfPossible);
}

//at the moment, it is possible (not always the case) that the subjects for the student will contain the grades in a format like ["Biologie1:13","Politik1:13"]
function intersectionWithRespectToGrade(
    subjectsStudent,
    subjectsPupil,
    gradePupil
) {
    //extract grade details
    let detailedSubjectsStudent = subjectsStudent.map(
        convertToSubjectWithGradeDetail
    );

    //remove those subject of the students that don't fit to the grade of the pupil
    detailedSubjectsStudent = detailedSubjectsStudent.filter((s) => {
        return (
            s.grade === null ||
            (s.grade !== null &&
                s.grade.lower <= gradePupil &&
                gradePupil <= s.grade.upper)
        );
    }); //if grade null, the grade doesn't matter for the student

    //normal intersection
    return intersection(
        subjectsPupil,
        detailedSubjectsStudent.map((s) => {
            return s.name;
        })
    );
}

export {
    subjectsAsArray,
    convertToSubjectWithGradeDetail,
    intersectionWithRespectToGrade,
    addDefaultGradeDetailToSubjectIfPossible,
    unifiedFormOfSubjects,
};
