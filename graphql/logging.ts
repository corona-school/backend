import { GraphQLRequestContext } from 'apollo-server-plugin-base';
import { isDev } from '../common/util/environment';
import { getLogger } from '../common/logger/logger';
import { toPublicToken } from './authentication';
import { Role } from './authorizations';
import { GraphQLContext } from './context';
import { isUnexpectedError } from './error';
import { v4 as uuidv4 } from 'uuid';

export const GraphQLLogger: any = {
    requestDidStart(requestContext: GraphQLRequestContext) {
        const startTime = Date.now();
        const logger = logInContext(`GraphQL Processing`, requestContext.context as GraphQLContext);

        // This will make sure that all the following logs will have the same uid field.
        const uid = uuidv4();
        logger.addContext('uid', uid);

        let query = requestContext.request.query;

        if (query.includes('password') || query.includes('authToken')) {
            query = 'REDACTED - CONTAINED SECRETS';
        }

        logger.info(`Started processing query`, { query });

        const handler: any = {
            // Actually GraphQLRequestListener, but we're on v2 and not on v3
            didEncounterErrors(requestContext: GraphQLRequestContext) {
                const unexpected = requestContext.errors.some(isUnexpectedError);
                if (unexpected) {
                    logger.info(`Expected Errors occurred`, { errors: requestContext.errors.map((it) => `  - ${it.name} (${it.message})`) });
                } else {
                    const errorLogger = logInContext(`GraphQL Error`, requestContext.context as GraphQLContext);
                    errorLogger.addContext('uid', uid);
                    errorLogger.error(`Unexpected Errors occurred:`, ...requestContext.errors);
                }
            },
            willSendResponse(requestContext: GraphQLRequestContext) {
                logger.info(
                    `Cache policy is ${JSON.stringify(requestContext.overallCachePolicy)}, cache was ${
                        requestContext.metrics.responseCacheHit ? 'hit' : 'missed'
                    }`
                );
                logger.info(`Finished processing`, { duration: Date.now() - startTime });

                if (isDev) {
                    logger.debug(`Responding with`, requestContext.response.data);
                }
            },
        };

        return handler;
    },
};

export function logInContext(name: string, context: GraphQLContext) {
    let sessionID = 'UNKNOWN';
    const { sessionToken, user } = context as GraphQLContext;
    if (sessionToken) {
        sessionID = toPublicToken(sessionToken);
    }

    if (user?.roles?.includes(Role.ADMIN)) {
        sessionID = 'ADMIN';
    }

    const logger = getLogger(name);
    logger.addContext('sessionID', sessionID);

    return logger;
}
