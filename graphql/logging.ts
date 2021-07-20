import { ApolloServerPlugin, GraphQLRequestContext, GraphQLRequestListener } from "apollo-server-plugin-base";
import { getLogger } from "log4js";
import { GraphQLContext } from "./context";

const logger = getLogger("GraphQL");
const isDev = process.env.NODE_ENV === "dev";

export const GraphQLLogger: ApolloServerPlugin = {
    async requestDidStart(requestContext) {
        logger.debug(`Request started`);

        const handler: GraphQLRequestListener = {
            async parsingDidStart() {
                logger.debug(`Parsing started`);
                return async (error) => {
                    if (error) {
                        logger.warn(`Parsing failed with:`, error);
                    } else {
                        logger.debug(`Parsing succeeded`);
                    }
                };
            },
            async validationDidStart() {
                logger.debug(`Validation started`);
                return async (errors) => {
                    if (errors.length) {
                        logger.warn(`Validation failed with:`, errors);
                    } else {
                        logger.debug(`Validation succeeded`);
                    }
                };
            },
            async executionDidStart() {
                logger.debug(`Execution started`);
                return { async executionDidEnd(error) {
                    if (error) {
                        logger.warn(`Execution failed with:`, error);
                    } else {
                        logger.debug(`Execution succeeded`);
                    }
                } };
            },
            async didEncounterErrors(requestContext) {
                logger.warn(`An error  occurred:`, requestContext.errors);
            },
            async willSendResponse(requestContext) {
                logger.debug(`Processed the query:\n${requestContext.request.query}`);

                if (requestContext.errors.length) {
                    logger.warn(`The following errors occured:`, requestContext.errors);
                } else if (isDev) {
                    logger.debug(`Successfully processed, responding with`, requestContext.response.data);
                } else {
                    logger.debug(`Successfully processed query`);
                }
            }
        };

        return handler;
    }
};