import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { JsonFilter } from "../inputs/JsonFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType("Match_pool_runWhereInput", {
  isAbstract: true
})
export class Match_pool_runWhereInput {
  @TypeGraphQL.Field(_type => [Match_pool_runWhereInput], {
    nullable: true
  })
  AND?: Match_pool_runWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Match_pool_runWhereInput], {
    nullable: true
  })
  OR?: Match_pool_runWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Match_pool_runWhereInput], {
    nullable: true
  })
  NOT?: Match_pool_runWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  runAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  matchingPool?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  matchesCreated?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => JsonFilter, {
    nullable: true
  })
  stats?: JsonFilter | undefined;
}
