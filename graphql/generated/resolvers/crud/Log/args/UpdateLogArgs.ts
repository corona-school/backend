import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogUpdateInput } from "../../../inputs/LogUpdateInput";
import { LogWhereUniqueInput } from "../../../inputs/LogWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateLogArgs {
  @TypeGraphQL.Field(_type => LogUpdateInput, {
    nullable: false
  })
  data!: LogUpdateInput;

  @TypeGraphQL.Field(_type => LogWhereUniqueInput, {
    nullable: false
  })
  where!: LogWhereUniqueInput;
}
