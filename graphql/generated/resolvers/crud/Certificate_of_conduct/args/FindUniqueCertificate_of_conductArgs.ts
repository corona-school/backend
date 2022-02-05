import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Certificate_of_conductWhereUniqueInput } from "../../../inputs/Certificate_of_conductWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueCertificate_of_conductArgs {
  @TypeGraphQL.Field(_type => Certificate_of_conductWhereUniqueInput, {
    nullable: false
  })
  where!: Certificate_of_conductWhereUniqueInput;
}
