import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { getSessionUser, GraphQLUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { UserType } from '../types/user';
import { getUserZAK } from '../../common/zoom/zoom-user';
import { MeetingRole } from '../../common/zoom';
import { generateMeetingSDKJWT } from '../../common/zoom';

type ZAKResponse = {
    token: string;
};
@Resolver((of) => UserType)
export class FieldMeResolver {
    @Query((returns) => UserType)
    @Authorized(Role.USER)
    async me(@Ctx() context: GraphQLContext): Promise<GraphQLUser> {
        return getSessionUser(context);
    }

    @Query((returns) => [String])
    @Authorized(Role.USER)
    myRoles(@Ctx() context: GraphQLContext): string[] {
        return context.user?.roles ?? [];
    }

    // TODO generateMeetingSDKJWT to join meeting
    @Query((returns) => String)
    @Authorized(Role.USER)
    zoomSDKJWT(@Ctx() context: GraphQLContext) {
        const sdkKey = generateMeetingSDKJWT(87975266869, MeetingRole.PARTICIPANT);
        return sdkKey;
    }

    @Query((returns) => String)
    @Authorized(Role.USER)
    async zoomZAK(@Ctx() context: GraphQLContext) {
        const { user } = context;
        const userZak = await getUserZAK(process.env.ZOOM_EMAIL);
        // if no user -> create user
        return userZak.token;
    }
}
