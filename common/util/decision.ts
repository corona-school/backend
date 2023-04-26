/* There are quite some scenarios where a user is allowed to do something according to some business rule,
    where in case the user is not allowed this is communicated to the user in the UI (to allow him to lift this limitation)
   The Decision type and it's utilities represent exactly that */

import { PrerequisiteError } from './error';

export type Decision<Reasons extends string = string> =
    | { allowed: true; reason?: Reasons; limit?: number }
    | { allowed: false; reason: Reasons; limit?: number };

export const ALLOW = { allowed: true };

export function assertAllowed(decision: Decision) {
    if (!decision.allowed) {
        throw new PrerequisiteError(`User is not allowed, reason: '${decision.reason}, limit: ${decision.limit ?? '-'}`);
    }
}
