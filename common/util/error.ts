/* Unlike server errors, client errors are the ones caused by faulty client-side logic */
export class ClientError extends Error {
    /* ATTENTION: The message is sent to the client and may not contain secrets! */
    constructor(public readonly type: string, public readonly publicMessage: string) {
        super(`ClientError(${type}): ${publicMessage}`);
    }
}

export class NotAllowedError extends Error {
    /* ATTENTION: The message is sent to the client and may not contain secrets! */
    constructor(public readonly type: string, public readonly publicMessage: string) {
        super(`NotAllowedError(${type}): ${publicMessage}`);
    }
}

const createClientError = (type: string) =>
    class extends ClientError {
        constructor(publicMessage: string) {
            super(type, publicMessage);
        }
    };

const createNotAllowedError = (type: string) =>
    class extends NotAllowedError {
        constructor(publicMessage: string) {
            super(type, publicMessage);
        }
    };

export const RedundantError = createClientError('REDUNDANT');
export const TooLateError = createClientError('TOO_LATE');
export const CapacityReachedError = createClientError('CAPACITY_REACHED');
export const PrerequisiteError = createClientError('PREREQUISITE');
