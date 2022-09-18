import { executeJob } from "../jobs/manualExecution";
import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { Role } from "./authorizations";
import { clearFilestore } from "./files";
import { rateLimitSummary, resetRateLimits } from "./rate-limit";

// Mutations for managing the backend, should usually only be used for testing purposes

@Resolver()
export class AdminMutationsResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async _executeJob(@Arg("job") job: string) {
        await executeJob(job);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    _clearFilestore() {
        clearFilestore();
        return true;
    }

    @Mutation(returns => String)
    @Authorized(Role.ADMIN)
    _getRateLimits() {
        return rateLimitSummary();
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    _resetRateLimits() {
        return resetRateLimits();
    }
}