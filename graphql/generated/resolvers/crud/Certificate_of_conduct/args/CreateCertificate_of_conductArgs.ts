import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Certificate_of_conductCreateInput } from "../../../inputs/Certificate_of_conductCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCertificate_of_conductArgs {
  @TypeGraphQL.Field(_type => Certificate_of_conductCreateInput, {
    nullable: false
  })
  data!: Certificate_of_conductCreateInput;
}
