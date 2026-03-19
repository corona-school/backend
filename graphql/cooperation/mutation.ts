import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { Cooperation } from '../generated';
import { Arg, Authorized, Field, InputType, Int, Mutation, Resolver } from 'type-graphql';
import { cooperation_type_enum as CooperationType } from '@prisma/client';

@InputType()
class CooperationInput {
    @Field()
    name: string;
    @Field()
    tag: string;
    @Field()
    welcomeTitle: string;
    @Field()
    welcomeMessage: string;
    @Field(() => CooperationType)
    type: CooperationType;
}

@Resolver((of) => Cooperation)
export class MutateCooperationResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async cooperationCreate(@Arg('data') data: CooperationInput) {
        await prisma.cooperation.create({
            data,
        });

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async cooperationUpdate(@Arg('id', (type) => Int) id: number, @Arg('data') data: CooperationInput) {
        await prisma.cooperation.update({
            where: { id },
            data,
        });

        return true;
    }
}
