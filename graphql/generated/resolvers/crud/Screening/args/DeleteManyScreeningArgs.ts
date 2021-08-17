import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreeningWhereInput } from "../../../inputs/ScreeningWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyScreeningArgs {
  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  where?: ScreeningWhereInput | undefined;
}
