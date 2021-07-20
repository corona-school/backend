import { GraphQLRequestContext } from "apollo-server-plugin-base";
import { getLogger } from "log4js";
const logger = getLogger("GraphQL");
const isDev = process.env.NODE_ENV === "dev";

export const GraphQLLogger: any = {
    requestDidStart(requestContext: GraphQLRequestContext) {
        const startTime = Date.now();
        logger.debug(`Started processing query`, requestContext.request.query);

        const handler: any = { // Actually GraphQLRequestListener, but we're on v2 and not on v3
            didEncounterErrors(requestContext: GraphQLRequestContext) {
                logger.warn(`Errors occurred:`, requestContext.errors);
            },
            willSendResponse(requestContext: GraphQLRequestContext) {
                logger.debug(`Finished processing after ${Date.now() - startTime}ms`);
                if (isDev) {
                    logger.debug(`Responding with`, requestContext.response.data);
                }
            }
        };

        return handler;
    }
};