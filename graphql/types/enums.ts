/* Enums need to be registered as documented in https://typegraphql.com/docs/0.16.0/enums.html */
import { registerEnumType } from 'type-graphql';

import { TutorJufoParticipationIndication, TuteeJufoParticipationIndication } from '../../common/jufo/participationIndication';
import {
    pupil_learninggermansince_enum as LearningGermanSince,
    pupil_languages_enum as Language,
    pupil_projectfields_enum as ProjectField,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_schooltype_enum as SchoolType,
    pupil_state_enum as State,
    student_state_enum as StudentState,
    student_module_enum as TeacherModule,
    student_languages_enum as StudentLanguage,
    notification_sender_enum as NotificationSender,
    course_category_enum as CourseCategory,
} from '@prisma/client';
import { MentoringCategory } from '../../common/mentoring/categories';
import { LoginOption } from '../../common/secret';

registerEnumType(SchoolType, {
    name: 'SchoolType',
});

registerEnumType(RegistrationSource, {
    name: 'RegistrationSource',
    description: "How the user came to Lern-Fair. The 'Cooperation' value has a special meaning, see 'state pupil'",
});

registerEnumType(ProjectField, {
    name: 'ProjectField',
    description: 'The academic field a project is in',
});

registerEnumType(State, {
    name: 'State',
    description: 'A state in the federal republic of germany',
});

registerEnumType(StudentState, {
    name: 'StudentState',
    description: 'A state in the federal republic of germany',
});

registerEnumType(TeacherModule, {
    name: 'TeacherModule',
});

registerEnumType(Language, {
    name: 'Language',
    description: 'languages commonly spoken at Lern-Fair (except TypeScript)',
});

registerEnumType(StudentLanguage, {
    name: 'StudentLanguage',
    description: 'languages commonly spoken at Lern-Fair (except TypeScript)',
});

registerEnumType(TuteeJufoParticipationIndication, {
    name: 'TuteeJufoParticipationIndication',
    description: 'A complicated way of storing TRUE / FALSE / NULL',
});

registerEnumType(TutorJufoParticipationIndication, {
    name: 'TutorJufoParticipationIndication',
    description: 'A different way of storing TRUE / FALSE / NULL',
});

registerEnumType(LearningGermanSince, {
    name: 'LearningGermanySince',
});

registerEnumType(NotificationSender, {
    name: 'NotificationSender',
});

registerEnumType(CourseCategory, {
    name: 'CourseCategory',
});

registerEnumType(MentoringCategory, {
    name: 'MentorCategory',
});

registerEnumType(LoginOption, { name: 'LoginOption' });
