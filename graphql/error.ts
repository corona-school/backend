import { ApolloError,  } from "apollo-server-errors";
import { getLogger } from "log4js";
import { ClientError, UserError } from "../common/util/error";

export { AuthenticationError, ForbiddenError, UserInputError, ValidationError } from "apollo-server-errors";

const log = getLogger("GraphQL Error");

export function formatError(error: ApolloError) {
    if (error.originalError instanceof ClientError) {
        return error;
    }

    if (error.originalError instanceof UserError) {
        return error;
    }

    log.error(error.originalError);
    throw new Error(`Internal Server Error - Consult logs for details`);
}