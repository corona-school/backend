import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import { Role } from './authorizations';
import { clearFilestore } from './files';
import { rateLimitSummary, resetRateLimits } from './rate-limit';
import { jobExists } from '../jobs/list';
import { UserInputError } from 'apollo-server-express';
import { runJob } from '../jobs/execute';
import { Doc } from './util';

// Mutations for managing the backend, should usually only be used for testing purposes

@Resolver()
export class AdminMutationsResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    @Doc('Schedules a Job for immediate Execution - Does not wait for the Job to be finished')
    _executeJob(@Arg('job') job: string) {
        if (!jobExists(job)) {
            throw new UserInputError(`No Job named '${job}'`);
        }

        void runJob(job);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    _clearFilestore() {
        clearFilestore();
        return true;
    }

    @Mutation((returns) => String)
    @Authorized(Role.ADMIN)
    _getRateLimits() {
        return rateLimitSummary();
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    _resetRateLimits() {
        resetRateLimits();
        return true;
    }
}
