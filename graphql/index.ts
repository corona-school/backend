// c.f. https://typegraphql.com/docs/0.17.5/installation.html
import 'reflect-metadata';

import { FindManyCourseResolver, applyResolversEnhanceMap, applyModelsEnhanceMap, FindManyStudentResolver, FindManyPupil_screeningResolver } from './generated';
import { buildSchemaSync } from 'type-graphql';
import {
    FindManyMatchResolver,
    FindManyPupilResolver,
    FindManyProject_matchResolver,
    FindManySubcourseResolver,
    FindManyLectureResolver,
    FindManyConcrete_notificationResolver,
    FindManyNotificationResolver,
    FindManySchoolResolver,
    FindManyScreenerResolver,
    FindManyCourse_tagResolver,
    Important_informationCrudResolver,
} from './generated/resolvers/crud';
import { authChecker, authorizationEnhanceMap, authorizationModelEnhanceMap } from './authorizations';
import { MutatePupilResolver } from './pupil/mutations';
import injectContext from './context';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLLogger } from './logging';
import { PluginDefinition } from 'apollo-server-core';
import { ExtendFieldsPupilResolver } from './pupil/fields';
import { ExtendedFieldsSubcourseResolver } from './subcourse/fields';
import { ExtendedFieldsCourseResolver } from './course/fields';
import { ExtendedFieldsMatchResolver } from './match/fields';
import { ExtendedFieldsProjectMatchResolver } from './project_match/fields';
import { MutateNotificationResolver } from './notification/mutations';
import { complexityEnhanceMap } from './complexity';
import { AuthenticationResolver } from './authentication';
import { FieldMeResolver } from './me/fields';
import { MutateMatchResolver } from './match/mutations';
import { MutateTutoringInterestConfirmationResolver } from './tutoring_interest_confirmation/mutations';
import { MutateParticipationCertificateResolver } from './certificate/mutations';
import { ExtendedFieldsParticipationCertificateResolver } from './certificate/fields';
import { ExtendFieldsStudentResolver } from './student/fields';
import { ExtendedFieldsLectureResolver, ExtendedFieldsOrganizerResolver, ExtendedFieldsParticipantResolver } from './appointment/fields';
import { MutateMeResolver } from './me/mutation';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { cacheModelEnhancementMap } from './cache';
import { MutateStudentResolver } from './student/mutations';
import { MutateCertificateOfConductResolver } from './certificate_of_conduct/mutations';
import { ExtendedFieldsCertificateOfConductResolver } from './certificate_of_conduct/fields';
import { isDev } from '../common/util/environment';
import { formatError } from './error';
import { NotificationBulkRunResolver, NotificationExtendedFieldsResolver } from './notification/fields';
import { FieldsMatchPoolResolver } from './match_pool/fields';
import { MutateMatchPoolResolver } from './match_pool/mutations';
import { MutateSecretResolver } from './secret/mutation';
import { MutateCourseResolver } from './course/mutations';
import { MutateConcreteNotificationsResolver } from './concrete_notification/mutations';
import { ExtendedFieldsConcreteNotificationResolver } from './concrete_notification/fields';
import { MutateSubcourseResolver } from './subcourse/mutations';
import { UserFieldsResolver } from './user/fields';
import { MutateUserResolver } from './user/mutations';
import { StatisticsResolver } from './statistics/fields';
import { AdminMutationsResolver } from './admin';
import { ExtendedFieldsTutorScreeningResolver } from './tutor_screening/fields';
import { ExtendedFieldsInstructorScreeningResolver } from './instructor_screening/fields';
import { MutateScreenerResolver } from './screener/mutations';
import { validate } from './validators';
import { ExtendedFieldsMessageTranslationResolver } from './message_translation/fields';
import { ExtendedFieldsPupil_screeningResolver } from './pupil_screening/fields';
import { MutateAppointmentResolver } from './appointment/mutations';
import { getCurrentTransaction } from '../common/session';
import { MutateChatResolver } from './chat/mutations';
import { playground } from './playground';
import { ExtendedFieldsScreenerResolver } from './screener/fields';
import { ExtendedFieldsCooperationResolver } from './cooperation/fields';
import { MutateCooperationResolver } from './cooperation/mutation';
import { FieldsChatResolver } from './chat/fields';
import { AchievementTemplateFieldResolver } from './achievement_template/fields';
import { MutateAchievementTemplateResolver } from './achievement_template/mutations';
import { LearningTopicFieldResolver } from './learning/topic/fields';
import { LearningAssignmentFieldResolver } from './learning/assignment/fields';
import { LearningNoteFieldResolver } from './learning/note/fields';
import { LearningTopicMutationsResolver } from './learning/topic/mutations';
import { LearningAssignmentMutationsResolver } from './learning/assignment/mutations';
import { LearningNoteMutationsResolver } from './learning/note/mutations';
import { ExternalSchoolResolver } from './external_school/fields';

applyResolversEnhanceMap(authorizationEnhanceMap);
applyResolversEnhanceMap(complexityEnhanceMap);
applyModelsEnhanceMap(authorizationModelEnhanceMap);
applyModelsEnhanceMap(cacheModelEnhancementMap);

const schema = buildSchemaSync({
    validate,
    resolvers: [
        /* User Authentication & Information */
        AuthenticationResolver,
        UserFieldsResolver,
        MutateUserResolver,
        FieldMeResolver,
        MutateMeResolver,

        /* Course */
        FindManyCourseResolver,
        ExtendedFieldsCourseResolver,
        FindManyCourse_tagResolver,

        FindManySubcourseResolver,
        ExtendedFieldsSubcourseResolver,
        MutateSubcourseResolver,

        ExtendedFieldsLectureResolver,
        FindManyLectureResolver,
        MutateCourseResolver,

        /* Pupil */
        FindManyPupilResolver,
        ExtendFieldsPupilResolver,
        MutatePupilResolver,

        /* Student */
        FindManyStudentResolver,
        ExtendFieldsStudentResolver,
        MutateStudentResolver,

        /* Match */
        FindManyMatchResolver,
        ExtendedFieldsMatchResolver,
        MutateMatchResolver,

        /* Projects */
        FindManyProject_matchResolver,
        ExtendedFieldsProjectMatchResolver,

        /* Notifications */
        FindManyNotificationResolver,
        MutateNotificationResolver,
        NotificationBulkRunResolver,
        NotificationExtendedFieldsResolver,
        FindManyConcrete_notificationResolver,
        ExtendedFieldsConcreteNotificationResolver,
        MutateConcreteNotificationsResolver,
        ExtendedFieldsMessageTranslationResolver,

        /* Important Information */
        Important_informationCrudResolver,

        /* TutoringInterestConfirmation */
        MutateTutoringInterestConfirmationResolver,

        /* ParticipationCertificate */
        ExtendedFieldsParticipationCertificateResolver,
        MutateParticipationCertificateResolver,

        /* Schools */
        FindManySchoolResolver,

        /* Certificate of Conduct */
        MutateCertificateOfConductResolver,
        ExtendedFieldsCertificateOfConductResolver,

        /* MatchPool */
        FieldsMatchPoolResolver,
        MutateMatchPoolResolver,

        /* Secret */
        MutateSecretResolver,

        /* Statistics */
        StatisticsResolver,

        /* Tutor Screenings */
        ExtendedFieldsTutorScreeningResolver,

        /* Instructor Screenings */
        ExtendedFieldsInstructorScreeningResolver,

        /* Pupil Screenings */
        FindManyPupil_screeningResolver,
        ExtendedFieldsPupil_screeningResolver,

        /* Screeners */
        FindManyScreenerResolver,
        ExtendedFieldsScreenerResolver,
        MutateScreenerResolver,

        /* Appointments */
        MutateAppointmentResolver,
        ExtendedFieldsParticipantResolver,
        ExtendedFieldsOrganizerResolver,

        /* Chat */
        FieldsChatResolver,
        MutateChatResolver,

        /* Cooperation */
        ExtendedFieldsCooperationResolver,
        MutateCooperationResolver,

        /* Achievement Templates */
        AchievementTemplateFieldResolver,
        MutateAchievementTemplateResolver,

        /* Admin */
        AdminMutationsResolver,

        /* Learning */
        LearningTopicFieldResolver,
        LearningTopicMutationsResolver,
        LearningAssignmentFieldResolver,
        LearningAssignmentMutationsResolver,
        LearningNoteFieldResolver,
        LearningNoteMutationsResolver,

        /** School Search */
        ExternalSchoolResolver,
    ],
    authChecker,
});

const plugins: PluginDefinition[] = [responseCachePlugin() as any, GraphQLLogger as any, playground];

export const apolloServer = new ApolloServer({
    schema,
    context: injectContext,
    plugins,
    // As this repository is open source anyways, there is no sense in keeping our graph private ("security by obscurity" doesn't work anyways)
    introspection: true,
    debug: isDev,
    formatError,
    formatResponse(response, requestContext) {
        const transaction = getCurrentTransaction();

        if (!response.extensions) {
            response.extensions = {};
        }

        response.extensions['Transaction'] = {
            sessionID: transaction.session?.sessionID ?? '?',
            transactionID: transaction.transactionID,
        };

        return response;
    },
});
