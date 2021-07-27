import { prisma } from "../../common/prisma";
import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";

const getPupil = (pupilId: number) => prisma.pupil.findUnique({ where: { id: pupilId }, rejectOnNotFound: true });

@Resolver(of => GraphQLModel.Pupil)
export class MutatePupilResolver {

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async addPupilTutoringMatch(/*to do*/ ): Promise<boolean>{
        /*to do*/
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async dissolveTutoringMatch(/*to do*/ ): Promise<boolean>{
        /*to do*/
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async editTutoringMatch(/*to do*/ ): Promise<boolean>{
        /*to do*/
        /*Edit subjects,status and priority*/
        return true;
    }
}