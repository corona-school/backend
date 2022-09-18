import { executeJob } from "../jobs/manualExecution";
import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { Role } from "./authorizations";

// Mutations for managing the backend, should usually only be used for testing purposes

@Resolver()
export class AdminMutationsResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async _jobExecute(@Arg("job") job: string) {
        await executeJob(job);
        return true;
    }
}