import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { getSessionUser, GraphQLUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { UserType } from '../types/user';
import { createZoomUser, getUserZAK, getZoomUser } from '../../common/zoom/zoom-user';
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

    // * pass role
    @Query((returns) => String)
    @Authorized(Role.USER)
    async zoomSDKJWT(@Ctx() context: GraphQLContext, @Arg('meetingId') meetingId: string, @Arg('role') role: number) {
        const meetingIdAsInt = parseInt(meetingId);
        const sdkKey = await generateMeetingSDKJWT(meetingIdAsInt, role);
        return sdkKey;
    }
    // TODO: ZAK Problem
    @Query((returns) => String)
    @Authorized(Role.USER)
    async zoomZAK(@Ctx() context: GraphQLContext) {
        const { user } = context;
        const zoomUser = await getZoomUser(user.email);
        if (zoomUser.email) {
            const userZak = await getUserZAK(user.email);
            return userZak.token;
        }
        const newZoomUser = await createZoomUser(user.email, user.firstname, user.lastname);
        const userZak = await getUserZAK(newZoomUser.email);
        return userZak.token;
    }
}
