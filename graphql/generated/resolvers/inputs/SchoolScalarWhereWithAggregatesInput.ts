import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolWithAggregatesFilter } from "../inputs/BoolWithAggregatesFilter";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { Enumschool_schooltype_enumWithAggregatesFilter } from "../inputs/Enumschool_schooltype_enumWithAggregatesFilter";
import { Enumschool_state_enumNullableWithAggregatesFilter } from "../inputs/Enumschool_state_enumNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringNullableWithAggregatesFilter } from "../inputs/StringNullableWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SchoolScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [SchoolScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: SchoolScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [SchoolScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: SchoolScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [SchoolScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: SchoolScalarWhereWithAggregatesInput[] | undefined;

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
  name?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  website?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  emailDomain?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumschool_state_enumNullableWithAggregatesFilter, {
    nullable: true
  })
  state?: Enumschool_state_enumNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumschool_schooltype_enumWithAggregatesFilter, {
    nullable: true
  })
  schooltype?: Enumschool_schooltype_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  activeCooperation?: BoolWithAggregatesFilter | undefined;
}
