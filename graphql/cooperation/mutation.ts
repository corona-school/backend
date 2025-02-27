import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { Cooperation } from '../generated';
import { Arg, Authorized, Field, InputType, Mutation, Resolver } from 'type-graphql';

@InputType()
class CreateCooperationInput {
    @Field()
    name: string;
    @Field()
    tag: string;

    @Field()
    welcomeTitle: string;
    @Field()
    welcomeMessage: string;
}

@Resolver((of) => Cooperation)
export class MutateCooperationResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async cooperationCreate(@Arg('data') data: CreateCooperationInput) {
        await prisma.cooperation.create({
            data,
        });

        return true;
    }
}
