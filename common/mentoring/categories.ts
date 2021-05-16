export enum MentoringCategory {
    LANGUAGE = "language",
    SUBJECTS = "subjects",
    DIDACTIC = "didactic",
    TECH = "tech",
    SELFORGA = "selforga",
    OTHER = "other"
}

export function contactEmailAddress(category: MentoringCategory) {
    switch (category) {
        case MentoringCategory.LANGUAGE:
            return "sprachliches@mentoring.lern-fair.de";
        case MentoringCategory.SUBJECTS:
            return "inhaltliches@mentoring.lern-fair.de";
        case MentoringCategory.DIDACTIC:
            return "paedagogisches@mentoring.lern-fair.de";
        case MentoringCategory.TECH:
            return "technisches@mentoring.lern-fair.de";
        case MentoringCategory.SELFORGA:
            return "selbststrukturierung@mentoring.lern-fair.de";
        case MentoringCategory.OTHER:
            return "mentoring@lern-fair.de";
    }
}