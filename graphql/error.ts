import { ApolloError } from "apollo-server-errors";
import { getLogger } from "log4js";
import { ClientError } from "../common/util/error";

export { AuthenticationError, ForbiddenError, UserInputError, ValidationError } from "apollo-server-errors";

const log = getLogger("GraphQL Error");

export const isUnexpectedError = (error: ApolloError) => error.name === "INTERNAL_SERVER_ERROR" && !(error.originalError instanceof ClientError);

export function formatError(error: ApolloError) {
    /* Expected errors are intended to be shared with users */
    if (!isUnexpectedError(error)) {
        return error;
    }

    /* All other kinds of errors are not expected here. Better not share them with clients, they might contain secrets! */
    throw new Error(`Internal Server Error - Consult logs for details`);
}