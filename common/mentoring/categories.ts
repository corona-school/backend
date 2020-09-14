export enum MentoringCategory {
    LANGUAGE = "language",
    SUBJECTS = "subjects",
    DIDACTIC = "didactic",
    TECH = "tech",
    SELFORGA = "selforga",
    OTHER = "other"
}

export namespace MentoringCategory {
    export function emailAddress(category: MentoringCategory) {
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
}