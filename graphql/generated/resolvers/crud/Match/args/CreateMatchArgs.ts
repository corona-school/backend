import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchCreateInput } from "../../../inputs/MatchCreateInput";

@TypeGraphQL.ArgsType()
export class CreateMatchArgs {
  @TypeGraphQL.Field(_type => MatchCreateInput, {
    nullable: false
  })
  data!: MatchCreateInput;
}
