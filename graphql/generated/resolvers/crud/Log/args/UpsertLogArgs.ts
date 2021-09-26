import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogCreateInput } from "../../../inputs/LogCreateInput";
import { LogUpdateInput } from "../../../inputs/LogUpdateInput";
import { LogWhereUniqueInput } from "../../../inputs/LogWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertLogArgs {
  @TypeGraphQL.Field(_type => LogWhereUniqueInput, {
    nullable: false
  })
  where!: LogWhereUniqueInput;

  @TypeGraphQL.Field(_type => LogCreateInput, {
    nullable: false
  })
  create!: LogCreateInput;

  @TypeGraphQL.Field(_type => LogUpdateInput, {
    nullable: false
  })
  update!: LogUpdateInput;
}
