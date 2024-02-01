export type Subject = {
    name: string;
    grade?: {
        min: number;
        max: number;
    };
    mandatory?: boolean;
};

// Historically we have not validated subject names
// This reflects the status quo from the database on 05-02-2023 and should be validated from now on
// To check the db, run:
// SELECT subject FROM (
//    SELECT (json_array_elements("subjects"::json)->'name')::varchar as subject FROM "pupil" UNION
//    SELECT (json_array_elements("subjects"::json)->'name')::varchar as subject FROM "student") AS subject GROUP BY subject ORDER BY subject ASC;

export const SUBJECTS = [
    'Altgriechisch',
    'Biologie',
    'Chemie',
    'Chinesisch',
    'Deutsch',
    'Deutsch als Zweitsprache',
    'Englisch',
    'Erdkunde',
    'Französisch',
    'Geschichte',
    'Informatik',
    'Italienisch',
    'Kunst',
    'Latein',
    'Mathematik',
    'Musik',
    'Niederländisch',
    'Pädagogik',
    'Philosophie',
    'Physik',
    'Politik',
    'Religion',
    'Russisch',
    'Sachkunde',
    'Spanisch',
    'Wirtschaft',
    'Lernen lernen',
] as const;

export const isValidSubjectName = (subject: string) => SUBJECTS.includes(subject as any);

export function isValidSubject(s: Subject) {
    return typeof s.name === 'string' && isValidSubjectName(s.name) && (!s.grade || (typeof s.grade.max === 'number' && typeof s.grade.min === 'number'));
}

// The format how subjects are stored in the database
export function toStudentSubjectDatabaseFormat(s: Subject) {
    if (!isValidSubject(s)) {
        throw new Error(`Invalid subject`);
    }

    if ('mandatory' in s) {
        throw new Error(`Only pupils may have mandatory subjects`);
    }

    return {
        name: s.name,
        maxGrade: s.grade?.max,
        minGrade: s.grade?.min,
    };
}
export function toPupilSubjectDatabaseFormat(s: Subject) {
    if (!isValidSubject(s)) {
        throw new Error(`Invalid subject`);
    }

    if ('grade' in s) {
        throw new Error(`Only students may have grade restrictions for subjects`);
    }

    return {
        name: s.name,
        mandatory: s.mandatory,
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

    return parsedArray.map((it) => {
        if (!it || !it.name) {
            throw new Error(`Invalid subject in "${subjects}"`);
        }
        if (typeof it.minGrade !== typeof it.maxGrade) {
            throw new Error(`minGrade and maxGrade must either be present or not in "${subjects}"`);
        }
        return {
            name: it.name,
            grade: it.minGrade
                ? {
                      min: it.minGrade,
                      max: it.maxGrade,
                  }
                : undefined,
            mandatory: it.mandatory,
        };
    });
}
