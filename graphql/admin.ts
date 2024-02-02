import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import { Role } from './authorizations';
import { clearFilestore } from './files';
import { rateLimitSummary, resetRateLimits } from './rate-limit';
import { jobExists } from '../jobs/list';
import { UserInputError } from 'apollo-server-express';
import { runJob } from '../jobs/execute';
import { Doc } from './util';
import { getUser } from '../common/user';
import { actionTaken } from '../common/notification';

// Mutations for managing the backend, should usually only be used for testing purposes

@Resolver()
export class AdminMutationsResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    @Doc('Schedules a Job for immediate Execution - The request might time out while the job is still running')
    async _executeJob(@Arg('job') job: string) {
        if (!jobExists(job)) {
            throw new UserInputError(`No Job named '${job}'`);
        }

        const success = await runJob(job);
        if (!success) {
            throw new Error(`Job Execution failed`);
        }

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

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    @Doc('Triggers actionTaken for the given user; Will be used for gamification testing.')
    async _userActionTaken(@Arg('action') action: string, @Arg('userID') userID: string) {
        const user = await getUser(userID);
        await actionTaken(user, action as any, {});
        return true;
    }
}
