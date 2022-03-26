import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogOrderByInput } from "../../../inputs/LogOrderByInput";
import { LogScalarWhereWithAggregatesInput } from "../../../inputs/LogScalarWhereWithAggregatesInput";
import { LogWhereInput } from "../../../inputs/LogWhereInput";
import { LogScalarFieldEnum } from "../../../../enums/LogScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByLogArgs {
  @TypeGraphQL.Field(_type => LogWhereInput, {
    nullable: true
  })
  where?: LogWhereInput | undefined;

  @TypeGraphQL.Field(_type => [LogOrderByInput], {
    nullable: true
  })
  orderBy?: LogOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [LogScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "logtype" | "createdAt" | "user" | "data">;

  @TypeGraphQL.Field(_type => LogScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: LogScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
