import {Arg, Authorized, Mutation, Resolver} from "type-graphql";
import * as GraphQLModel from "../generated/models";
import {Role} from "../authorizations";
import {Certificate_of_conductCreateInput} from "../generated";

@Resolver( of => GraphQLModel.Certificate_of_conduct)
export class MutateCertificateOfConductResolver{
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async cocCreate(@Arg("certificateOfConduct") certificateOfConduct: Certificate_of_conductCreateInput) {
    }
}