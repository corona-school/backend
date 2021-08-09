import { FindManyCourseResolver, applyResolversEnhanceMap } from "./generated";
import { buildSchemaSync } from "type-graphql";
import { FindManyMatchResolver, FindManyPupilResolver, FindManyProject_matchResolver, FindManySubcourseResolver, FindManyLectureResolver, FindManyConcrete_notificationResolver, FindManyNotificationResolver } from "./generated/resolvers/crud";
import { authChecker, authorizationEnhanceMap } from "./authorizations";
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

applyResolversEnhanceMap(authorizationEnhanceMap);

const schema = buildSchemaSync({
    resolvers: [
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

        /* Match */
        FindManyMatchResolver,
        ExtendedFieldsMatchResolver,

        /* Projects */
        FindManyProject_matchResolver,
        ExtendedFieldsProjectMatchResolver,

        /* Notifications */
        FindManyNotificationResolver,
        MutateNotificationResolver,
        FindManyConcrete_notificationResolver
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
    playground: {
        title: "GraphQL@LernFair",
        tabs: [
            {
                name: "Hello World",
                query: `# GraphQL Playground\n# To get access, contact the TECH Team`
            },
            {
                name: "Example Query",
                query: `query {
                    courses {
                      id,
                      name,
                      subcourses {
                        maxParticipants
                        participantsCount
                        lectures {
                            start
                          duration
                        }
                      }
                    }
                  }`
            }
        ]
    }
});
