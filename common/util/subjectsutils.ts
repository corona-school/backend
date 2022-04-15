
export type Subject = {
    name: string;
    grade?: {
        min: number;
        max: number;
    };
    mandatory?: boolean;
};

export function isValidSubject(s: Subject) {
    return typeof s.name === "string"
            && (!s.grade || (typeof s.grade.max === "number" && typeof s.grade.min === "number"));
}

// The format how subjects are stored in the database
export function toStudentSubjectDatabaseFormat(s: Subject) {
    if ("mandatory" in s) {
        throw new Error(`Only pupils may have mandatory subjects`);
    }

    return {
        name: s.name,
        maxGrade: s.grade?.max,
        minGrade: s.grade?.min
    };
}
export function toPupilSubjectDatabaseFormat(s: Subject) {
    if ("minGrade" in s || "maxGrade" in s) {
        throw new Error(`Only students may have grade restrictions for subjects`);
    }

    return {
        name: s.name,
        mandatory: s.mandatory
    };
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

    return parsedArray.map(it => {
        if (!it || !it.name) {
            throw new Error(`Invalid subject in "${subjects}"`);
        }
        if (typeof it.minGrade !== typeof it.maxGrade) {
            throw new Error(`minGrade and maxGrade must either be present or not in "${subjects}"`);
        }
        return {
            name: it.name,
            grade: it.minGrade ? {
                min: it.minGrade,
                max: it.maxGrade
            } : undefined,
            mandatory: it.mandatory
        };
    });
}

export function checkCoDuSubjectRequirements(subjects: Subject[]) {
    // CoDu requires that one of Math, English, German is selected and that this
    // is taught in one of the grades 8 to 10
    const relevantSubjects = subjects.filter(s =>
        ["mathematik", "deutsch", "englisch"].includes(s.name.toLowerCase()) &&
        (!s.grade || (s.grade.min <= 10 && s.grade.max >= 8))
    );

    return relevantSubjects.length > 0;
}