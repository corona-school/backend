export enum MentoringCategory {
    LANGUAGE = "language",
    SUBJECTS = "subjects",
    DIDACTIC = "didactic",
    TECH = "tech",
    SELFORGA = "selforga",
    OTHER = "other"
}

export function getFriendlyName(category: MentoringCategory) {
    switch (category) {
        case MentoringCategory.LANGUAGE:
            return "Sprachschwierigkeiten und Kommunikation";
        case MentoringCategory.SUBJECTS:
            return "Inhaltliche Kompetenzen in bestimmten Unterrichtsfächern";
        case MentoringCategory.DIDACTIC:
            return "Pädagogische und didaktische Hilfestellungen";
        case MentoringCategory.TECH:
            return "Technische Unterstützung";
        case MentoringCategory.SELFORGA:
            return "Organisatorisches und Selbststrukturierung";
        case MentoringCategory.OTHER:
            return "Sonstiges";
    }
}

export function contactEmailAddress(category: MentoringCategory) {
    switch (category) {
        case MentoringCategory.LANGUAGE:
            return "sprachliches@mentoring.corona-school.de";
        case MentoringCategory.SUBJECTS:
            return "inhaltliches@mentoring.corona-school.de";
        case MentoringCategory.DIDACTIC:
            return "paedagogisches@mentoring.corona-school.de";
        case MentoringCategory.TECH:
            return "technisches@mentoring.corona-school.de";
        case MentoringCategory.SELFORGA:
            return "selbststrukturierung@mentoring.corona-school.de";
        case MentoringCategory.OTHER:
            return "mentoring@corona-school.de";
    }
}