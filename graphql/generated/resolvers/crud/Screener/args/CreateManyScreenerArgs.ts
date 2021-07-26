import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerCreateManyInput } from "../../../inputs/ScreenerCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyScreenerArgs {
  @TypeGraphQL.Field(_type => [ScreenerCreateManyInput], {
    nullable: false
  })
  data!: ScreenerCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
