import { Role } from '../authorizations';
import { Screener } from '../generated';
import { Arg, Authorized, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { createToken } from '../../common/secret';
import { userForScreener } from '../../common/user';
import { getLogger } from '../../common/logger/logger';
import { getScreener } from '../util';
import { ValidateEmail } from '../validators';

const log = getLogger('ScreenerMutations');

@InputType()
class ScreenerCreateInput {
    @Field()
    @ValidateEmail()
    email: string;
    @Field()
    firstname: string;
    @Field()
    lastname: string;
}

@Resolver((of) => Screener)
export class MutateScreenerResolver {
    @Mutation((returns) => String)
    @Authorized(Role.ADMIN)
    async screenerCreate(@Arg('data') data: ScreenerCreateInput) {
        const { email, firstname, lastname } = data;

        const screener = await prisma.screener.create({
            data: {
                email,
                firstname,
                lastname,
                password: 'DEPRECATED',
                active: true,
                verifiedAt: new Date(),
            },
        });

        const token = await createToken(userForScreener(screener));

        log.info(`Admin created Screener(${screener.id}) and retrieved a login token`, data);

        return token;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async screenerActivate(@Arg('screenerId') screenerId: number, @Arg('active') active: boolean) {
        const screener = await getScreener(screenerId);
        await prisma.screener.update({ data: { active }, where: { id: screener.id } });
        log.info(`Admin set Screener(${screener.id}) to ${active ? 'active' : 'inactive'}`);
        return true;
    }
}
