import { GraphQLRequestContext } from 'apollo-server-plugin-base';
import { isDev } from '../common/util/environment';
import { getLogger } from '../common/logger/logger';
import { stats, metrics } from '../common/logger/metrics';
import { v4 as uuidv4 } from 'uuid';

const logger = getLogger('GraphQL Query');

export const GraphQLLogger: any = {
    requestDidStart(requestContext: GraphQLRequestContext) {
        const startTime = Date.now();

        // This will make sure that all the following logs will have the same uid field.
        const uid = uuidv4();
        logger.addContext('uid', uid);

        let query = requestContext.request.query;

        if (query.includes('password') || query.includes('authToken')) {
            query = 'REDACTED - CONTAINED SECRETS';
        }

        logger.info(`Started processing query`, { query });

        const handler: any = {
            willSendResponse(requestContext: GraphQLRequestContext) {
                logger.info(
                    `Cache policy is ${JSON.stringify(requestContext.overallCachePolicy)}, cache was ${
                        requestContext.metrics.responseCacheHit ? 'hit' : 'missed'
                    }`
                );
                logger.info(`Finished processing`, { duration: Date.now() - startTime, query });

                if (isDev) {
                    logger.debug(`Responding with`, requestContext.response.data);
                }

                const errorCount = requestContext.response?.errors?.length || 0;
                stats.increment(metrics.GRAPHQL_REQUESTS, { operation: requestContext.operation.operation, hasErrors: `${errorCount > 0}` });
            },
        };

        return handler;
    },
};
