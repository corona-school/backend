import { ApolloError } from 'apollo-server-errors';
import { GraphQLError } from 'graphql';
import { getLogger } from 'log4js';
import { ArgumentValidationError } from 'type-graphql';
import { ClientError } from '../common/util/error';

export { AuthenticationError, ForbiddenError, UserInputError, ValidationError } from 'apollo-server-errors';

export const isUnexpectedError = (error: GraphQLError) => {
    return (
        !error.extensions ||
        (error.extensions.code === 'INTERNAL_SERVER_ERROR' &&
            !(error.originalError instanceof ClientError || error.originalError instanceof ArgumentValidationError))
    );
};

export function isErrorSafeToExpose(err: ApolloError) {
    if (!err.extensions) {
        return false;
    }

    switch (err.extensions.code) {
        case 'BAD_USER_INPUT':
            return true;
        case 'GRAPHQL_VALIDATION_FAILED':
            return true;
        default:
            return false;
    }
}

const logger = getLogger('ApolloError');

export function formatError(error: ApolloError) {
    /* Expected errors are intended to be shared with users */
    if (!isUnexpectedError(error)) {
        logger.info('Expected Errors occurred', { error: `${error.name} (${error.message})` });
        // Send ClientError Type to client
        if (error.originalError instanceof ClientError) {
            return new ApolloError(error.originalError.publicMessage, error.originalError.type);
        }

        return error;
    }

    logger.error(`Unexpected Errors occurred`, error, { stack: error?.originalError?.stack });
    if (isErrorSafeToExpose(error)) {
        return error;
    }
    /* All other kinds of errors are not expected here. Better not share them with clients, they might contain secrets! */
    return new Error(`Internal Server Error - Consult logs for details`);
}
