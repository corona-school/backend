import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchWhereInput } from "../../../inputs/MatchWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyMatchArgs {
  @TypeGraphQL.Field(_type => MatchWhereInput, {
    nullable: true
  })
  where?: MatchWhereInput | undefined;
}
