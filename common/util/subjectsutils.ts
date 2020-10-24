
export type Subject = {
    name: string;
    gradeInfo?: {
        min: number;
        max: number;
    };
};

export function isValidSubject(s: Subject) {
    return typeof s.name === "string"
            && (!s.gradeInfo || (typeof s.gradeInfo.max === "number" && typeof s.gradeInfo.min === "number"));
}

// The format how subjects are stored in the database
export function toStudentSubjectDatabaseFormat(s: Subject) {
    return {
        name: s.name,
        maxGrade: s.gradeInfo?.max,
        minGrade: s.gradeInfo?.min
    };
}

function parseJSONObjectFormatGradeArray(parsedArray: any[]) {
    return parsedArray.flatMap( s => {
        if (typeof s.name !== "string") return [];
        if ((typeof s.minGrade === "number" && typeof s.maxGrade !== "number") || (typeof s.maxGrade === "number" && typeof s.minGrade !== "number")) return [];
        return {
            name: s.name,
            grade: s.minGrade ? {
                min: s.minGrade,
                max: s.maxGrade
            } : undefined
        };
    });
}

function parseMatlabFormatGradeArray(parsedArray: any[]) {
    return parsedArray.flatMap( s => {
        const matches = s.match(/^([a-zA-Zäöüß]+)(([0-9]+):([0-9]+))*$/);
        if (!matches) return [];
        if (matches[1] && matches[2]) return {
            name: matches[1],
            grade: {
                min: +matches[3],
                max: +matches[4]
            }
        };
        if (matches[1] && !matches[2]) return {
            name: matches[1]
        };
        return [];
    });
}

export function parseSubjectString(subjects: string): Subject[] {
    if (!subjects) {
        return [];
    }

    //check if is array
    const parsedArray: any[] = JSON.parse(subjects);
    if (!Array.isArray(parsedArray)) {
        throw new Error(`Invalid subject format string "${subjects}". Cannot parse this!`);
    }

    //check if every element is in the grade format
    const parsedJSONObjectFormatGradeArray = parseJSONObjectFormatGradeArray(parsedArray);

    //alternatively check if every element is in the matlab format
    if (parsedJSONObjectFormatGradeArray.length === parsedArray.length) {
        //return the parsed result
        return parsedJSONObjectFormatGradeArray;
    }

    //try to check the matlab format
    const parsedMatlabFormatGradeArray = parseMatlabFormatGradeArray(parsedArray);

    if (parsedMatlabFormatGradeArray.length === parsedArray.length) {
        return parsedMatlabFormatGradeArray;
    }

    return undefined;
}