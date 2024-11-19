import { Arg, Authorized, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, Role } from '../authorizations';
import { RateLimit } from '../rate-limit';
import { LinkedInTokenCreate, LinkedInPostCreate, saveLinkedInToken, postImageToLinkedIn, getLinkedInAccessToken } from '../../common/linkedin';

@InputType()
class LinkedInTokenInput implements Omit<LinkedInTokenCreate, 'userId'> {
    @Field()
    accessToken: string;

    @Field()
    expiresAt: Date;
}

@InputType()
class LinkedInPostInput implements Omit<LinkedInPostCreate, 'userId'> {
    @Field()
    imageUrl: string;

    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    commentary?: string;
}

@InputType()
class LinkedInAuthInput {
    @Field()
    code: string;

    @Field()
    redirectUri: string;
}

@Resolver()
export class LinkedInMutationsResolver {
    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    @RateLimit('LinkedIn Token Save', 100, /* per */ 60 * 60 * 1000 /* = 1 hour */)
    async saveLinkedInToken(@Ctx() context: GraphQLContext, @Arg('input') input: LinkedInTokenInput) {
        await saveLinkedInToken({
            ...input,
            userId: context.user.userID,
        });
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    @RateLimit('LinkedIn Post Image', 100, /* per */ 60 * 60 * 1000 /* = 1 hour */)
    async postImageToLinkedIn(@Ctx() context: GraphQLContext, @Arg('input') input: LinkedInPostInput) {
        await postImageToLinkedIn({
            ...input,
            userId: context.user.userID,
        });
        return true;
    }

    @Mutation(() => String)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    @RateLimit('LinkedIn Get Access Token', 100, /* per */ 60 * 60 * 1000 /* = 1 hour */)
    async getLinkedInAccessToken(@Ctx() context: GraphQLContext, @Arg('input') input: LinkedInAuthInput) {
        const { code, redirectUri } = input;

        // Get client ID and secret from environment variables
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('LinkedIn client credentials not configured');
        }

        const response = await getLinkedInAccessToken(code, redirectUri, clientId, clientSecret);

        // Return just the access token
        return response.access_token;
    }
}
