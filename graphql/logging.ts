import { GraphQLRequestContext } from "apollo-server-plugin-base";
import { isDev } from "../common/util/environment";
import { getLogger } from "log4js";
import { toPublicToken } from "./authentication";
import { Role } from "./authorizations";
import { GraphQLContext } from "./context";
const logger = getLogger("GraphQL Processing");

export const GraphQLLogger: any = {
    requestDidStart(requestContext: GraphQLRequestContext) {
        const startTime = Date.now();

        let sessionID = "UNKNOWN";
        const { sessionToken, user } = requestContext.context as GraphQLContext;
        if (sessionToken) {
            sessionID = toPublicToken(sessionToken);
        }

        if (user?.roles?.includes(Role.ADMIN)) {
            sessionID = "ADMIN";
        }

        let query = requestContext.request.query;

        if (query.includes("password") || query.includes("authToken")) {
            query = "REDACTED - CONTAINED SECRETS";
        }

        logger.debug(`[${sessionID}] Started processing query`, query);

        const handler: any = { // Actually GraphQLRequestListener, but we're on v2 and not on v3
            didEncounterErrors(requestContext: GraphQLRequestContext) {
                logger.warn(`[${sessionID}] Errors occurred:`, requestContext.errors);
            },
            willSendResponse(requestContext: GraphQLRequestContext) {
                if (!isDev) {
                    return;
                }
                logger.debug(`[${sessionID}] Finished processing after ${Date.now() - startTime}ms`);
                logger.debug(`[${sessionID}] Responding with`, requestContext.response.data);
                logger.debug(`[${sessionID}] Cache policy is ${JSON.stringify(requestContext.overallCachePolicy)}, cache was ${requestContext.metrics.responseCacheHit ? "hit" : "missed"}`);
            }
        };

        return handler;
    }
};