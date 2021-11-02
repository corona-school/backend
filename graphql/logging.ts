import { GraphQLRequestContext } from "apollo-server-plugin-base";
import { getLogger } from "log4js";
import { toPublicToken } from "./authentication";
import { Role } from "./authorizations";
import { GraphQLContext } from "./context";
const logger = getLogger("GraphQL Processing");
const isDev = process.env.NODE_ENV === "dev";

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
                logger.debug(`[${sessionID}] Finished processing after ${Date.now() - startTime}ms`);
                if (isDev) {
                    logger.debug(`[${sessionID}] Responding with`, requestContext.response.data);
                }
            }
        };

        return handler;
    }
};