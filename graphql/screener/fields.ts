import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { userForScreener } from '../../common/user';
import { Screener } from '../generated';
import { UserType } from '../types/user';
import { Role } from '../../common/user/roles';

@Resolver((of) => Screener)
export class ExtendedFieldsScreenerResolver {
    @FieldResolver((returns) => UserType)
    @Authorized(Role.OWNER, Role.ADMIN)
    user(@Root() screener: Required<Screener>) {
        return userForScreener(screener);
    }
}
