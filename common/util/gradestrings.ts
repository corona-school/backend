function gradeAsInt(gradeStr: string) {
    return parseInt(gradeStr.substring(0, gradeStr.search(/\D/)));
}

export {
    gradeAsInt
}