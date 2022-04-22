import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolWithAggregatesFilter } from "../inputs/BoolWithAggregatesFilter";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { Enumexpert_data_allowed_enumWithAggregatesFilter } from "../inputs/Enumexpert_data_allowed_enumWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringNullableWithAggregatesFilter } from "../inputs/StringNullableWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("Expert_dataScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Expert_dataScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Expert_dataScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Expert_dataScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_dataScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Expert_dataScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_dataScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Expert_dataScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  createdAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  updatedAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  contactEmail?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  description?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  active?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumexpert_data_allowed_enumWithAggregatesFilter, {
    nullable: true
  })
  allowed?: Enumexpert_data_allowed_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  studentId?: IntNullableWithAggregatesFilter | undefined;
}
