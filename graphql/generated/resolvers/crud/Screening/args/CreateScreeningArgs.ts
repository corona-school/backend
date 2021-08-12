import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreeningCreateInput } from "../../../inputs/ScreeningCreateInput";

@TypeGraphQL.ArgsType()
export class CreateScreeningArgs {
  @TypeGraphQL.Field(_type => ScreeningCreateInput, {
    nullable: false
  })
  data!: ScreeningCreateInput;
}
