import { State } from "../entity/State";
import { SchoolType } from "../entity/SchoolType";
import { MentoringCategory } from "../mentoring/categories";
import { ProjectField } from "../jufo/projectFields";
import { TuteeJufoParticipationIndication, TutorJufoParticipationIndication } from "../jufo/participationIndication";
import { TeacherModule } from "../entity/Student";


const EnumReverseMappings = {
    State: reverseMappingForStringEnum(State),
    SchoolType: reverseMappingForStringEnum(SchoolType),
    MentoringCategory: reverseMappingForStringEnum(MentoringCategory),
    ProjectField: reverseMappingForStringEnum(ProjectField),
    TutorJufoParticipationIndication: reverseMappingForStringEnum(TutorJufoParticipationIndication),
    TuteeJufoParticipationIndication: reverseMappingForStringEnum(TuteeJufoParticipationIndication),
    TeacherModule: reverseMappingForStringEnum(TeacherModule)
};

function reverseMappingForStringEnum<E>(e: E): ((s: string) => E[keyof E]) {
    //this would be equivalent to check whether `Object.values(ENUM)` contains `s` and then return s
    return (s: string) => {
        return Object.entries(e).find( ([, value]) => typeof value === "string" && value === s)?.[1];
    };
}

export {
    EnumReverseMappings,
    reverseMappingForStringEnum
};