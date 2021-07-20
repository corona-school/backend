import { getLogger } from "log4js";
const logger = getLogger("GraphQL");
const isDev = process.env.NODE_ENV === "dev";

export const GraphQLLogger: any = {
    requestDidStart(requestContext) {
        logger.debug(`Request started`);

        const handler: any = { // Actually GraphQLRequestListener, but we're on v2 and not on v3
            parsingDidStart() {
                logger.debug(`Parsing started`);
                return (error) => {
                    if (error) {
                        logger.warn(`Parsing failed with:`, error);
                    } else {
                        logger.debug(`Parsing succeeded`);
                    }
                };
            },
            validationDidStart() {
                logger.debug(`Validation started`);
                return (errors) => {
                    if (errors?.length) {
                        logger.warn(`Validation failed with:`, errors);
                    } else {
                        logger.debug(`Validation succeeded`);
                    }
                };
            },
            executionDidStart() {
                logger.debug(`Execution started`);
                return { executionDidEnd(error) {
                    if (error) {
                        logger.warn(`Execution failed with:`, error);
                    } else {
                        logger.debug(`Execution succeeded`);
                    }
                } };
            },
            didEncounterErrors(requestContext) {
                logger.warn(`An error  occurred:`, requestContext.errors);
            },
            willSendResponse(requestContext) {
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