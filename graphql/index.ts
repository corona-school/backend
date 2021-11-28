import { FindManyCourseResolver, applyResolversEnhanceMap, applyModelsEnhanceMap } from "./generated";
import { buildSchemaSync } from "type-graphql";
import { FindManyMatchResolver, FindManyPupilResolver, FindManyProject_matchResolver, FindManySubcourseResolver, FindManyLectureResolver, FindManyConcrete_notificationResolver, FindManyNotificationResolver } from "./generated/resolvers/crud";
import { authChecker, authorizationEnhanceMap, authorizationModelEnhanceMap } from "./authorizations";
import { MutatePupilResolver } from "./pupil/mutations";
import injectContext from "./context";
import { ApolloServer } from "apollo-server-express";
import { GraphQLLogger } from "./logging";
import { plugin as apolloTracing } from "apollo-tracing";
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

applyResolversEnhanceMap(authorizationEnhanceMap);
applyResolversEnhanceMap(complexityEnhanceMap);
applyModelsEnhanceMap(authorizationModelEnhanceMap);

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
        ExtendFieldsStudentResolver,

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
        FindManyConcrete_notificationResolver,

        /* TutoringInterestConfirmation */
        MutateTutoringInterestConfirmationResolver,

        /* ParticipationCertificate */
        ExtendedFieldsParticipationCertificateResolver,
        MutateParticipationCertificateResolver
    ],
    authChecker
});

const plugins: PluginDefinition[] = [
    GraphQLLogger as any
];

const isDev = process.env.ENV === "dev";

if (isDev) {
    plugins.push(apolloTracing());
}

export const apolloServer = new ApolloServer({
    schema,
    context: injectContext,
    plugins,
    // As this repository is open source anyways, there is no sense in keeping our graph private ("security by obscurity" doesn't work anyways)
    introspection: true,
    playground: true
});
