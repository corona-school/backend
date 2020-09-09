import { State } from "../entity/State";
import { SchoolType } from "../entity/Pupil";
import { MentoringCategory } from "../mentoring/categories";

const EnumReverseMappings = {
    State: (s: string) => {
        return State[s.toUpperCase()];
    },
    SchoolType: (s: string) => {
        switch (s.toLocaleLowerCase()) {
            case "grundschule":
                return SchoolType.GRUNDSCHULE;
            case "gesamtschule":
                return SchoolType.GESAMTSCHULE;
            case "hauptschule":
                return SchoolType.HAUPTSCHULE;
            case "realschule":
                return SchoolType.REALSCHULE;
            case "gymnasium":
                return SchoolType.GYMNASIUM;
            case "förderschule":
                return SchoolType.FOERDERSCHULE;
            case "other":
                return SchoolType.SONSTIGES;
            default:
                return undefined;
        }
    },
    MentoringCategory: (s: string) => {
        return MentoringCategory[s.toUpperCase()];
    }
};


export {
    EnumReverseMappings
};