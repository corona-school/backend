import { GraphQLRequestContext } from "apollo-server-plugin-base";
import { isDev } from "../common/util/environment";
import { getLogger } from "log4js";
import { toPublicToken } from "./authentication";
import { Role } from "./authorizations";
import { GraphQLContext } from "./context";

export const GraphQLLogger: any = {
    requestDidStart(requestContext: GraphQLRequestContext) {
        const startTime = Date.now();
        const logger = logInContext(`GraphQL Processing`, requestContext.context as GraphQLContext);


        let query = requestContext.request.query;

        if (query.includes("password") || query.includes("authToken")) {
            query = "REDACTED - CONTAINED SECRETS";
        }

        logger.debug(`Started processing query`, query);

        const handler: any = { // Actually GraphQLRequestListener, but we're on v2 and not on v3
            didEncounterErrors(requestContext: GraphQLRequestContext) {
                logger.warn(`Errors occurred:`, requestContext.errors);
            },
            willSendResponse(requestContext: GraphQLRequestContext) {
                logger.info(`Cache policy is ${JSON.stringify(requestContext.overallCachePolicy)}, cache was ${requestContext.metrics.responseCacheHit ? "hit" : "missed"}`);
                logger.info(`Finished processing after ${Date.now() - startTime}ms`);

                if (isDev) {
                    logger.debug(`Responding with`, requestContext.response.data);
                }
            }
        };

        return handler;
    }
};

export function logInContext(name: string, context: GraphQLContext) {
    let sessionID = "UNKNOWN";
    const { sessionToken, user } = context as GraphQLContext;
    if (sessionToken) {
        sessionID = toPublicToken(sessionToken);
    }

    if (user?.roles?.includes(Role.ADMIN)) {
        sessionID = "ADMIN";
    }

    return getLogger(`${name} [${sessionID}]`);
}