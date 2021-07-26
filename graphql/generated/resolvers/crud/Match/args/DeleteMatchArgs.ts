import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchWhereUniqueInput } from "../../../inputs/MatchWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteMatchArgs {
  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: false
  })
  where!: MatchWhereUniqueInput;
}
