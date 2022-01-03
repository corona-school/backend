/* Unlike server errors, client errors are the ones caused by faulty client-side logic */
export class ClientError extends Error {
    /* ATTENTION: The message is sent to the client and may not contain secrets! */
    constructor(public readonly type: string, public readonly publicMessage: string) {
        super(`ClientError(${type}): ${publicMessage}`);
    }
}

const createClientError = (type: string) => class extends ClientError {
    constructor(publicMessage: string) {
        super(type, publicMessage);
    }
};

export const RedundantError = createClientError("Redundant");
export const TooLateError = createClientError("TooLate");
export const CapacityReachedError = createClientError("CapacityReached");
export const PrerequisiteError = createClientError("Prerequisite");