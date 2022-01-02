/* Unlike server errors, client errors are the ones caused by faulty client-side logic */
export class ClientError extends Error {
    /* The internalMessage stays in server logs */
    constructor(public readonly type: string, public readonly internalMessage: string) {
        super(`ClientError(${type}): ${internalMessage}`);
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

/* Unlike client and server errors, user errors are the ones caused by a wrong user action. 
   The user should be able to react to this error */
export class UserError extends Error {
    /* The internalMessage stays in server logs */
    constructor(public readonly type: string, public readonly internalMessage: string) {
        super(`UserError(${type}): ${internalMessage}`);
    }
}

const createUserError = (type: string) => class extends UserError {
    constructor(internalMessage: string) {
        super(type, internalMessage);
    }
};