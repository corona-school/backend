/* Enums need to be registered as documented in https://typegraphql.com/docs/0.16.0/enums.html */
import { registerEnumType } from "type-graphql";

import { State } from "../../common/entity/State";
import { TeacherModule } from "../../common/entity/Student";
import { Language } from "../../common/daz/language";
import { TutorJufoParticipationIndication, TuteeJufoParticipationIndication } from "../../common/jufo/participationIndication";
import { pupil_learninggermansince_enum as LearningGermanSince } from "@prisma/client";
import { RegistrationSource } from "../../common/entity/Person";
import { ProjectField } from "../../common/jufo/projectFields";

registerEnumType(RegistrationSource, {
    name: "RegistrationSource",
    description: "How the user came to Lern-Fair. The 'Cooperation' value has a special meaning, see 'state pupil'"
});

registerEnumType(ProjectField, {
    name: "ProjectField",
    description: "The academic field a project is in"
});

registerEnumType(State, {
    name: "State",
    description: "A state in the federal republic of germany"
});

registerEnumType(TeacherModule, {
    name: "TeacherModule"
});

registerEnumType(Language, {
    name: "Language",
    description: "languages commonly spoken at Lern-Fair (except TypeScript)"
});

registerEnumType(TuteeJufoParticipationIndication, {
    name: "TuteeJufoParticipationIndication",
    description: "A complicated way of storing TRUE / FALSE / NULL"
});

registerEnumType(TutorJufoParticipationIndication, {
    name: "TutorJufoParticipationIndication",
    description: "A different way of storing TRUE / FALSE / NULL"
});

registerEnumType(LearningGermanSince, {
    name: "LearningGermanySince"
});