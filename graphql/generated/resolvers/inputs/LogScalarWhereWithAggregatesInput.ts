import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { Enumlog_logtype_enumWithAggregatesFilter } from "../inputs/Enumlog_logtype_enumWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LogScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [LogScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: LogScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [LogScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: LogScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [LogScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: LogScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumlog_logtype_enumWithAggregatesFilter, {
    nullable: true
  })
  logtype?: Enumlog_logtype_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  createdAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  user?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  data?: StringWithAggregatesFilter | undefined;
}
