/* Enums need to be registered as documented in https://typegraphql.com/docs/0.16.0/enums.html */
import { registerEnumType } from 'type-graphql';

import {
    pupil_learninggermansince_enum as LearningGermanSince,
    pupil_languages_enum as Language,
    pupil_registrationsource_enum as RegistrationSource,
    pupil_schooltype_enum as SchoolType,
    pupil_state_enum as State,
    student_state_enum as StudentState,
    student_languages_enum as StudentLanguage,
    notification_sender_enum as NotificationSender,
    course_category_enum as CourseCategory,
    pupil_screening_status_enum as PupilScreeningStatus,
    gender_enum as Gender,
    course_subject_enum,
    school_schooltype_enum,
    course_schooltype_enum,
    pupil_email_owner_enum as PupilEmailOwner,
    student_screening_status_enum as StudentScreeningStatus,
} from '@prisma/client';
import { LoginOption } from '../../common/secret';
import { StudentScreeningType } from '../../common/student/screening';
import { AppointmentRole } from '../../common/appointment/util';

registerEnumType(PupilEmailOwner, {
    name: 'PupilEmailOwner',
});

registerEnumType(SchoolType, {
    name: 'SchoolType',
});

registerEnumType(RegistrationSource, {
    name: 'RegistrationSource',
    description: "How the user came to Lern-Fair. The 'Cooperation' value has a special meaning, see 'state pupil'",
});

registerEnumType(State, {
    name: 'State',
    description: 'A state in the federal republic of germany',
});

registerEnumType(StudentState, {
    name: 'StudentState',
    description: 'A state in the federal republic of germany',
});

registerEnumType(Language, {
    name: 'Language',
    description: 'languages commonly spoken at Lern-Fair (except TypeScript)',
});

registerEnumType(StudentLanguage, {
    name: 'StudentLanguage',
    description: 'languages commonly spoken at Lern-Fair (except TypeScript)',
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

registerEnumType(Gender, {
    name: 'Gender',
});

registerEnumType(LoginOption, { name: 'LoginOption' });

registerEnumType(PupilScreeningStatus, { name: 'PupilScreeningStatus' });

registerEnumType(course_subject_enum, {
    name: 'CourseSubjectEnum',
    description: 'The subject of the course',
});

registerEnumType(school_schooltype_enum, {
    name: 'SchoolSchoolTypeEnum',
    description: 'The type of school',
});

registerEnumType(course_schooltype_enum, {
    name: 'CourseSchoolTypeEnum',
    description: 'The type of school',
});

registerEnumType(StudentScreeningStatus, { name: 'StudentScreeningStatus' });
registerEnumType(StudentScreeningType, { name: 'StudentScreeningType' });
registerEnumType(AppointmentRole, { name: 'AppointmentRole' });
