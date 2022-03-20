import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeNullableWithAggregatesFilter } from "../inputs/DateTimeNullableWithAggregatesFilter";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput[] | undefined;

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
  status?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  token?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableWithAggregatesFilter, {
    nullable: true
  })
  reminderSentDate?: DateTimeNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  pupilId?: IntNullableWithAggregatesFilter | undefined;
}
