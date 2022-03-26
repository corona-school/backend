import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { JsonWithAggregatesFilter } from "../inputs/JsonWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Match_pool_runScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Match_pool_runScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Match_pool_runScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Match_pool_runScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Match_pool_runScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Match_pool_runScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Match_pool_runScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  runAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  matchingPool?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  matchesCreated?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => JsonWithAggregatesFilter, {
    nullable: true
  })
  stats?: JsonWithAggregatesFilter | undefined;
}
