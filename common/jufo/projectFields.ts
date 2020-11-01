export enum ProjectField {
    ARBEITSWELT = "Arbeitswelt",
    BIOLOGIE = "Biologie",
    CHEMIE = "Chemie",
    GEO_RAUM = "Geo-und-Raumwissenschaften", //don't use spaces here due to a typeorm issue, see https://github.com/typeorm/typeorm/issues/5275
    MATHE_INFO = "Mathematik/Informatik",
    PHYSIK = "Physik",
    TECHNIK = "Technik"
}


export function getOfficialProjectFieldName(pf: ProjectField) {
    switch (pf) {
        case ProjectField.ARBEITSWELT:
            return "Arbeitswelt";
        case ProjectField.BIOLOGIE:
            return "Biologie";
        case ProjectField.CHEMIE:
            return "Chemie";
        case ProjectField.GEO_RAUM:
            return "Geo- und Raumwissenschaften";
        case ProjectField.MATHE_INFO:
            return "Mathematik/Informatik";
        case ProjectField.PHYSIK:
            return "Physik";
        case ProjectField.TECHNIK:
            return "Technik";
    }
}