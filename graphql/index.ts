import {
    FindManyCourseResolver,
    applyResolversEnhanceMap,
    applyModelsEnhanceMap,
    FindManyStudentResolver
} from "./generated";
import { buildSchemaSync } from "type-graphql";
import { FindManyMatchResolver, FindManyPupilResolver, FindManyProject_matchResolver, FindManySubcourseResolver, FindManyLectureResolver, FindManyConcrete_notificationResolver, FindManyNotificationResolver, FindManySchoolResolver } from "./generated/resolvers/crud";
import { authChecker, authorizationEnhanceMap, authorizationModelEnhanceMap } from "./authorizations";
import { MutatePupilResolver } from "./pupil/mutations";
import injectContext from "./context";
import { ApolloServer } from "apollo-server-express";
import { GraphQLLogger } from "./logging";
import { PluginDefinition } from "apollo-server-core";
import { ExtendFieldsPupilResolver } from "./pupil/fields";
import { ExtendedFieldsSubcourseResolver } from "./subcourse/fields";
import { ExtendedFieldsCourseResolver } from "./course/fields";
import { ExtendedFieldsMatchResolver } from "./match/fields";
import { ExtendedFieldsProjectMatchResolver } from "./project_match/fields";
import { MutateNotificationResolver } from "./notification/mutations";
import { complexityEnhanceMap } from "./complexity";
import { AuthenticationResolver } from "./authentication";
import { FieldMeResolver } from "./me/fields";
import { MutateMatchResolver } from "./match/mutations";
import { MutateTutoringInterestConfirmationResolver } from "./tutoring_interest_confirmation/mutations";
import { MutateParticipationCertificateResolver } from "./certificate/mutations";
import { ExtendedFieldsParticipationCertificateResolver } from "./certificate/fields";
import { ExtendFieldsStudentResolver } from "./student/fields";
import { MutateMeResolver } from "./me/mutation";
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { cacheModelEnhancementMap } from "./cache";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ExtendedFieldsSchoolResolver } from "./school/fields";
import { MutateStudentResolver } from "./student/mutation";
import { MutateCertificateOfConductResolver } from "./certificate_of_conduct/mutations";
import { ExtendedFieldsCertificateOfConductResolver } from "./certificate_of_conduct/fields";
import { ExtendedFieldsStudentResolver } from "./student/field";
import { isDev } from "../common/util/environment";
import { formatError } from "./error";
import { NotificationBulkRunResolver } from "./notification/fields";
import { FieldsMatchPoolResolver } from "./match_pool/fields";
import { MutateMatchPoolResolver } from "./match_pool/mutations";

applyResolversEnhanceMap(authorizationEnhanceMap);
applyResolversEnhanceMap(complexityEnhanceMap);
applyModelsEnhanceMap(authorizationModelEnhanceMap);
applyModelsEnhanceMap(cacheModelEnhancementMap);

const schema = buildSchemaSync({
    resolvers: [
        /* User Authentication & Information */
        AuthenticationResolver,
        FieldMeResolver,
        MutateMeResolver,

        /* Course */
        FindManyCourseResolver,
        ExtendedFieldsCourseResolver,

        FindManySubcourseResolver,
        ExtendedFieldsSubcourseResolver,

        FindManyLectureResolver,

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
        FindManyConcrete_notificationResolver,

        /* TutoringInterestConfirmation */
        MutateTutoringInterestConfirmationResolver,

        /* ParticipationCertificate */
        ExtendedFieldsParticipationCertificateResolver,
        MutateParticipationCertificateResolver,

        /* Schools */
        FindManySchoolResolver,
        ExtendedFieldsSchoolResolver,

        /* Certificate of Conduct */
        MutateCertificateOfConductResolver,
        ExtendedFieldsCertificateOfConductResolver,

        /* MatchPool */
        FieldsMatchPoolResolver,
        MutateMatchPoolResolver
    ],
    authChecker
});

const plugins: PluginDefinition[] = [
    responseCachePlugin() as any,
    GraphQLLogger as any,
    ApolloServerPluginLandingPageGraphQLPlayground()
];


export const apolloServer = new ApolloServer({
    schema,
    context: injectContext,
    plugins,
    // As this repository is open source anyways, there is no sense in keeping our graph private ("security by obscurity" doesn't work anyways)
    introspection: true,
    debug: isDev,
    formatError
});
