import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolWithAggregatesFilter } from "../inputs/BoolWithAggregatesFilter";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType("Certificate_of_conductScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Certificate_of_conductScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Certificate_of_conductScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Certificate_of_conductScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Certificate_of_conductScalarWhereWithAggregatesInput[] | undefined;

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

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  dateOfInspection?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  dateOfIssue?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  criminalRecords?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  studentId?: IntNullableWithAggregatesFilter | undefined;
}
