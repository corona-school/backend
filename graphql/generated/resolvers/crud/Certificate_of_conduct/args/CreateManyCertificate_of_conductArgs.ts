import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Certificate_of_conductCreateManyInput } from "../../../inputs/Certificate_of_conductCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyCertificate_of_conductArgs {
  @TypeGraphQL.Field(_type => [Certificate_of_conductCreateManyInput], {
    nullable: false
  })
  data!: Certificate_of_conductCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
