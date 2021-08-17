import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchCreateManyInput } from "../../../inputs/MatchCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyMatchArgs {
  @TypeGraphQL.Field(_type => [MatchCreateManyInput], {
    nullable: false
  })
  data!: MatchCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
