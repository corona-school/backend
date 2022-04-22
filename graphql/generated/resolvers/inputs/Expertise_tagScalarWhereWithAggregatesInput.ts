import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("Expertise_tagScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Expertise_tagScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Expertise_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Expertise_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expertise_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Expertise_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expertise_tagScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Expertise_tagScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  name?: StringWithAggregatesFilter | undefined;
}
