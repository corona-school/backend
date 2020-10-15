export enum ProjectField {
    ARBEITSWELT = "Arbeitswelt",
    BIOLOGIE = "Biologie",
    CHEMIE = "Chemie",
    GEO_RAUM = "Geo-und-Raumwissenschaften", //don't use spaces here due to a typeorm issue, see https://github.com/typeorm/typeorm/issues/5275
    MATHE_INFO = "Mathematik/Informatik",
    PHYSIK = "Physik",
    TECHNIK = "Technik"
}