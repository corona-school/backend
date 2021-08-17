import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreeningCreateInput } from "../../../inputs/ScreeningCreateInput";
import { ScreeningUpdateInput } from "../../../inputs/ScreeningUpdateInput";
import { ScreeningWhereUniqueInput } from "../../../inputs/ScreeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertScreeningArgs {
  @TypeGraphQL.Field(_type => ScreeningWhereUniqueInput, {
    nullable: false
  })
  where!: ScreeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreeningCreateInput, {
    nullable: false
  })
  create!: ScreeningCreateInput;

  @TypeGraphQL.Field(_type => ScreeningUpdateInput, {
    nullable: false
  })
  update!: ScreeningUpdateInput;
}
