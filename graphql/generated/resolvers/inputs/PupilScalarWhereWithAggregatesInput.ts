import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolWithAggregatesFilter } from "../inputs/BoolWithAggregatesFilter";
import { DateTimeNullableWithAggregatesFilter } from "../inputs/DateTimeNullableWithAggregatesFilter";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { Enumpupil_languages_enumNullableListFilter } from "../inputs/Enumpupil_languages_enumNullableListFilter";
import { Enumpupil_learninggermansince_enumNullableWithAggregatesFilter } from "../inputs/Enumpupil_learninggermansince_enumNullableWithAggregatesFilter";
import { Enumpupil_projectfields_enumNullableListFilter } from "../inputs/Enumpupil_projectfields_enumNullableListFilter";
import { Enumpupil_registrationsource_enumWithAggregatesFilter } from "../inputs/Enumpupil_registrationsource_enumWithAggregatesFilter";
import { Enumpupil_schooltype_enumWithAggregatesFilter } from "../inputs/Enumpupil_schooltype_enumWithAggregatesFilter";
import { Enumpupil_state_enumWithAggregatesFilter } from "../inputs/Enumpupil_state_enumWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringNullableWithAggregatesFilter } from "../inputs/StringNullableWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("PupilScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class PupilScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [PupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: PupilScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: PupilScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: PupilScalarWhereWithAggregatesInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  firstname?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  lastname?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  active?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  email?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  verification?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableWithAggregatesFilter, {
    nullable: true
  })
  verifiedAt?: DateTimeNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  authToken?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  authTokenUsed?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableWithAggregatesFilter, {
    nullable: true
  })
  authTokenSent?: DateTimeNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  wix_id?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  wix_creation_date?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_state_enumWithAggregatesFilter, {
    nullable: true
  })
  state?: Enumpupil_state_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_schooltype_enumWithAggregatesFilter, {
    nullable: true
  })
  schooltype?: Enumpupil_schooltype_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  msg?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  grade?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  newsletter?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  isPupil?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  subjects?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  openMatchRequestCount?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  isParticipant?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  isProjectCoachee?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_projectfields_enumNullableListFilter, {
    nullable: true
  })
  projectFields?: Enumpupil_projectfields_enumNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  isJufoParticipant?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  openProjectMatchRequestCount?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  projectMemberCount?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_languages_enumNullableListFilter, {
    nullable: true
  })
  languages?: Enumpupil_languages_enumNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_learninggermansince_enumNullableWithAggregatesFilter, {
    nullable: true
  })
  learningGermanSince?: Enumpupil_learninggermansince_enumNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  matchingPriority?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableWithAggregatesFilter, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: DateTimeNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  teacherEmailAddress?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_registrationsource_enumWithAggregatesFilter, {
    nullable: true
  })
  registrationSource?: Enumpupil_registrationsource_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  coduToken?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  schoolId?: IntNullableWithAggregatesFilter | undefined;
}
