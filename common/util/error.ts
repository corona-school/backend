/* Unlike server errors, client errors are the ones caused by faulty client-side logic */
export class ClientError extends Error {
    /* ATTENTION: The message is sent to the client and may not contain secrets! */
    constructor(public readonly type: string, public readonly publicMessage: string) {
        super(`ClientError(${type}): ${publicMessage}`);
    }
}

const createClientError = (type: string) =>
    class extends ClientError {
        constructor(publicMessage: string) {
            super(type, publicMessage);
        }
    };

export const RedundantError = createClientError('REDUNDANT');
export const TooLateError = createClientError('TOO_LATE');
export const CapacityReachedError = createClientError('CAPACITY_REACHED');
export const PrerequisiteError = createClientError('PREREQUISITE');
export const NotAllowedError = createClientError('NOT_ALLOWED');

export class ZoomError extends Error {
    constructor(public readonly message: string, public readonly status: number, public readonly code?: number) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
