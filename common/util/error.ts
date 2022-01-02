/* Unlike server errors, client errors are the ones caused by faulty client-side logic */
export class ClientError extends Error {
    /* ATTENTION: The message is sent to the client and may not contain secrets! */
    constructor(public readonly type: string, public readonly message: string) {
        super(`ClientError(${type}): ${message}`);
    }
}

const createClientError = (type: string) => class extends ClientError {
    constructor(internalMessage: string) {
        super(type, internalMessage);
    }
};

export const RedundantError = createClientError("Redundant");
export const TooLateError = createClientError("TooLate");
export const CapacityReachedError = createClientError("CapacityReached");
export const PrerequisiteError = createClientError("Prerequisite");