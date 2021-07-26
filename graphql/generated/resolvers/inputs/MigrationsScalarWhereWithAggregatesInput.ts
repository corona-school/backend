import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MigrationsScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [MigrationsScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: MigrationsScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [MigrationsScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: MigrationsScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [MigrationsScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: MigrationsScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  timestamp?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  name?: StringWithAggregatesFilter | undefined;
}
