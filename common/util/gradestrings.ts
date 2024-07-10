function gradeAsInt(gradeStr?: string) {
    if (!gradeStr) {
        return null;
    }

    return parseInt(gradeStr.substring(0, gradeStr.search(/\D/)));
}

function gradeAsString(gradeInt: number) {
    return `${gradeInt}. Klasse`;
}

export { gradeAsInt, gradeAsString };
