import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { DateTimeNullableFilter } from "../inputs/DateTimeNullableFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { PupilRelationFilter } from "../inputs/PupilRelationFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType("Pupil_tutoring_interest_confirmation_requestWhereInput", {
  isAbstract: true
})
export class Pupil_tutoring_interest_confirmation_requestWhereInput {
  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestWhereInput], {
    nullable: true
  })
  AND?: Pupil_tutoring_interest_confirmation_requestWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestWhereInput], {
    nullable: true
  })
  OR?: Pupil_tutoring_interest_confirmation_requestWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestWhereInput], {
    nullable: true
  })
  NOT?: Pupil_tutoring_interest_confirmation_requestWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  status?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  token?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  reminderSentDate?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  pupilId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => PupilRelationFilter, {
    nullable: true
  })
  pupil?: PupilRelationFilter | undefined;
}
