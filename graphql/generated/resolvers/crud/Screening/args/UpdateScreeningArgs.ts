import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreeningUpdateInput } from "../../../inputs/ScreeningUpdateInput";
import { ScreeningWhereUniqueInput } from "../../../inputs/ScreeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateScreeningArgs {
  @TypeGraphQL.Field(_type => ScreeningUpdateInput, {
    nullable: false
  })
  data!: ScreeningUpdateInput;

  @TypeGraphQL.Field(_type => ScreeningWhereUniqueInput, {
    nullable: false
  })
  where!: ScreeningWhereUniqueInput;
}
